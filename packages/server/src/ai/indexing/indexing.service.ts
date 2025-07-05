import { Document } from '@langchain/core/documents';
import { Inject, Injectable } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { ChromadbService } from 'src/infra/chromadb/chromadb.service';

import {
  KnowledgeBase,
  TextKnowledgeBase,
} from 'src/ai/knowledge-base/schema/knowledge-base.schema';
import { KnowledgeBaseType } from 'src/ai/knowledge-base/types/knowledge-base.type';

@Injectable()
export class IndexingService {
  constructor(@Inject() private readonly chromaDbService: ChromadbService) {}

  async triggerIndexing(agentId: string, knowledgeBase: KnowledgeBase[]) {
    try {
      for (const kb of knowledgeBase) {
        const documents = await this.loadDocumentsFromSource(kb);
        if (!documents?.length) continue;

        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 600,
          chunkOverlap: 100,
        });
        const chunks = await textSplitter.splitDocuments(documents);

        await this.chromaDbService.addDocumentToAgentCollection(
          agentId,
          chunks,
        );

        return this.chromaDbService.queryAgentCollection(
          agentId,
          'Shubhaman Gill',
        );
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  private async loadDocumentsFromSource(
    kb: KnowledgeBase,
  ): Promise<Document[]> {
    switch (kb.type as KnowledgeBaseType) {
      case KnowledgeBaseType.TEXT:
        return new Promise((res) => {
          res([
            new Document({ pageContent: (kb as TextKnowledgeBase).content }),
          ]);
        });
      case KnowledgeBaseType.FILE:
      case KnowledgeBaseType.LINK:
      default:
        return new Promise((res) => {
          res([]);
        });
    }
  }
}
