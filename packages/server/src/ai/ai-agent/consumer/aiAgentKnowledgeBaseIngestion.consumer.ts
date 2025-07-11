import { Document } from '@langchain/core/documents';
import {
  Controller,
  Inject,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { flatMap, map } from 'lodash';
import { MessagingTopicConstant } from 'src/core/constant/messaging-topic.constant';
import { Status } from '../../../core/types/status';
import { ChromadbService } from '../../../infra/chromadb/chromadb.service';
import { RAGIndexService } from '../../../infra/chromadb/ragIndex.service';
import { KnowbaseContentExtractorService } from '../../knowledge-base/knowbase-content-extractor.service';
import { KnowledgeBaseService } from '../../knowledge-base/knowledge-base.service';
import { AiAgentKnowledgeBaseContentInjectionParams } from '../types/ai-agent.type';
import { RAGIndex } from '../../../infra/chromadb/schema/ragIndex.schema';
import { ChromaDBResourceType } from 'src/infra/chromadb/type/chromadb.type';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { AuthContextType } from 'src/auth/dto/auth.dto';
/**
 * This can be triggered when Agent is updated with knowledge base. Update / Delete
 * Knowledge base content cannot be updated so no need to trigger this event on delete of knowledge base
 * Knowledge base cannot be deleted without removing all associated agents so no need to trigger this event on delete of knowledge base
 */
@Controller()
export class AiAgentKnowledgeBaseIngestionConsumer {
  private readonly logger = new Logger(
    AiAgentKnowledgeBaseIngestionConsumer.name,
  );

  constructor(
    @Inject() private readonly knowledgeBaseService: KnowledgeBaseService,
    @Inject()
    private readonly knowledgeBaseExtractorService: KnowbaseContentExtractorService,
    @Inject() private readonly chromaDbService: ChromadbService,
    @Inject() private readonly ragIndexService: RAGIndexService,
  ) {}

  @MessagePattern(
    MessagingTopicConstant.TopicNames.AiAgentKnowledgeBaseContentIngestionTopic,
  )
  async ingestContent(params: AiAgentKnowledgeBaseContentInjectionParams) {
    const { agentId, addedKnowledgeBaseIds, removedKnowledgeBaseIds } = params;

    if (!addedKnowledgeBaseIds || !removedKnowledgeBaseIds) {
      this.logger.log(
        `[Task received] for Agent ${agentId}: Nothing to do. No added or removed knowledge bases.`,
      );
      return;
    }

    this.logger.debug(
      `[Task received] for Agent ${agentId}: AddedKb=[${addedKnowledgeBaseIds?.join(', ')}], RemovedKb=[${removedKnowledgeBaseIds?.join(', ')}]`,
    );

    try {
      await Promise.all([
        addedKnowledgeBaseIds.length
          ? this._processAddedKnowledgeBases(agentId, addedKnowledgeBaseIds)
          : Promise.resolve(),
        removedKnowledgeBaseIds.length
          ? this._processRemovedKnowledgeBases(agentId, removedKnowledgeBaseIds)
          : Promise.resolve(),
      ]);
    } catch (error) {
      this.logger.error(
        `Error processing knowledge base content injection for Agent ${agentId}: ${(error as Error).message}`,
      );
      throw new InternalServerErrorException(error);
    }
  }

  private async _processAddedKnowledgeBases(
    agentId: string,
    knowledgeBaseIds: string[],
  ) {
    /**
     * Create a indexing task for DB referencing to kb
     * extract content for knowledge base, add metadata about loading source.
     * Update knowledge base loading status. Add metadata and persist it to database
     * If index is not there in vector DB, create it else update it
     * Index to vector DB
     * Update the indexing task
     */

    this.logger.debug('Loading kbs and start creating ragIndexes');
    const kbs = await this.knowledgeBaseService.findMany(knowledgeBaseIds);
    const ragIndexes = await this.ragIndexService.createMany(
      map(
        kbs,
        (kb) =>
          ({
            indexName: `${kb.name}_${kb._id}`,
            resourceId: kb._id,
            resourceType: ChromaDBResourceType.AgentKnowledgeBase,
            status: Status.InProgress,
          }) as Partial<RAGIndex>,
      ),
    );
    this.logger.debug('RagIndexes in progress Db entry created');

    this.logger.debug('Starting document extraction and chunk creation');
    const chunks = await Promise.all(
      map(kbs, async (kb) => {
        try {
          let document: Document;
          if (
            (kb.sourceContentMetadata?.status as Status) === Status.Completed &&
            kb.content
          )
            document = new Document({
              pageContent: kb.content,
              id: kb._id,
              metadata: {},
            });
          const extractedDocument =
            await this.knowledgeBaseExtractorService.extractContentForKnowledgeBase(
              kb,
            );
          document = new Document({
            pageContent: extractedDocument.pageContent,
            id: kb._id,
            metadata: extractedDocument.metadata,
          });
          this.logger.debug(`Content extracted for KB ${kb._id}`);

          await this.knowledgeBaseService.update(
            kb._id,
            {
              content: document.pageContent,
              sourceContentMetadata: {
                status: Status.Completed,
                metadata: extractedDocument.metadata as Map<string, any>,
              },
            },
            {
              userId: kb.creator,
            } as AuthContextType,
          );
          this.logger.debug(`KB ${kb._id} source content metadata updated`);

          if (!document) return [];

          const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 600,
            chunkOverlap: 100,
          });
          const chunks = await textSplitter.splitDocuments([document]);
          return chunks;
        } catch (error) {
          this.logger.error(
            `Error splitting document for KB ${kb._id}: ${error}`,
          );
          return [];
        }
      }),
    );
    this.logger.debug('Document splitting completed');

    await this.chromaDbService.addDocumentToCollection(
      agentId,
      ChromaDBResourceType.AgentKnowledgeBase,
      flatMap(chunks),
    );
    this.logger.debug('Document ingestion completed');

    await Promise.all(
      map(ragIndexes, (ri) =>
        this.ragIndexService.update(ri._id!, { status: Status.Completed }),
      ),
    );
    this.logger.debug('RAG index status updated');
  }

  private async _processRemovedKnowledgeBases(
    agentId: string,
    knowledgeBaseIds: string[],
  ) {
    await this.chromaDbService.deleteDocuments(
      agentId,
      ChromaDBResourceType.AgentKnowledgeBase,
      knowledgeBaseIds,
    );
  }
}
