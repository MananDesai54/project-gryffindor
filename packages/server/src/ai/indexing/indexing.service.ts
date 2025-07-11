import { Document } from '@langchain/core/documents';
import { Inject, Injectable } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { ChromadbService } from '../../infra/chromadb/chromadb.service';

import { ChromaDBResourceType } from '../../infra/chromadb/type/chromadb.type';
import { KnowledgeBase } from '../knowledge-base/schema/knowledge-base.schema';
import { KnowledgeBaseType } from '../knowledge-base/types/knowledge-base.type';

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

        await this.chromaDbService.addDocumentToCollection(
          agentId,
          ChromaDBResourceType.AgentKnowledgeBase,
          chunks,
        );

        // return this.chromaDbService.queryCollection(
        //   agentId,
        //   ChromaDBResourceType.Agent,
        //   "Shubman Gill first in 148 years of Test history to do the unthinkable, also shatters Gavaskar's 54-year-old India record",
        // );
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
      case KnowledgeBaseType.FILE:
      case KnowledgeBaseType.LINK:
        return new Promise((res) => {
          res([new Document({ pageContent: kb.content, id: kb._id })]);
        });
      default:
        return new Promise((res) => {
          res([]);
        });
    }
  }
}
