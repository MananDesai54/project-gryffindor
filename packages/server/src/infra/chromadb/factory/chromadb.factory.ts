import { Injectable } from '@nestjs/common';
import { ChromadbService } from '../chromadb.service';
import { ChromaDBResourceType } from '../type/chromadb.type';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { Document } from '@langchain/core/documents';
import { map } from 'lodash';

@Injectable()
export class ChromaDbFactory {
  constructor(private readonly chromaDbService: ChromadbService) {}

  createRetrieverTool(
    resourceId: string,
    resourceType: ChromaDBResourceType,
    resourceName: string,
    toolDescription: string,
  ): DynamicStructuredTool {
    const schema = z.object({
      query: z
        .string()
        .describe(
          'The specific question or topic to search for in the knowledge base.',
        ),
    });

    return new DynamicStructuredTool({
      name: `VectorDbQuery_Tool`,
      description: `This tool allows you to query your Vector database for more information. ${toolDescription}`,
      schema: schema,
      func: async ({ query }: { query: string }) => {
        try {
          const response = await this.chromaDbService.queryCollection(
            resourceId,
            resourceType,
            query,
          );

          if (response.documents.length === 0) {
            return `No relevant information found for the query: "${query}"`;
          }

          return this._formatDocumentsToString(
            map(
              response.documents,
              (doc) =>
                new Document({
                  pageContent: doc?.join('.'),
                }),
            ),
          );
        } catch (error) {
          return `An error occurred while searching the knowledge base. ${error}`;
        }
      },
    });
  }

  // getRetrieverTool(
  //   resourceId: string,
  //   resourceType: ChromaDBResourceType,
  //   resourceName: string,
  //   resourceDescription: string,
  // ): ReturnType<typeof createRetrieverTool> {
  //   const vectorStore = new Chroma(this.embeddings, {
  //     collectionName: this._getCollectionName(resourceId, resourceType),
  //     url: process.env.CHROMA_URL,
  //   });

  //   const retriever = vectorStore.asRetriever({
  //     k: 5,
  //   });

  //   return createRetrieverTool(retriever, {
  //     name: resourceName,
  //     description: `This tool Retrieves relevant information for ${resourceName} based on the provided query. ${resourceType} is for ${resourceDescription}`,
  //   });
  // }
  //

  // ==================== Private Methods ====================

  private _formatDocumentsToString(docs: Document[]): string {
    return docs
      .map(
        (doc, index) =>
          `--- Document ${index + 1} ---\nSource: ${doc.metadata.source || 'N/A'}\nContent: ${doc.pageContent}\n--- End Document ${index + 1} ---`,
      )
      .join('\n\n');
  }
}
