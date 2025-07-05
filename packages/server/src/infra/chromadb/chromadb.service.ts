import { Chroma } from '@langchain/community/vectorstores/chroma';
import { Document } from '@langchain/core/documents';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { ChromaClient } from 'chromadb';
import { createRetrieverTool } from 'langchain/tools/retriever';
import { ChromaDBResourceType } from './type/chromadb.type';

@Injectable()
export class ChromadbService {
  private readonly chromaClient: ChromaClient;
  private readonly embeddings: OpenAIEmbeddings;

  constructor() {
    this.chromaClient = new ChromaClient({
      host: process.env.CHROMA_HOST,
      port: +process.env.CHROMA_PORT,
    });
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      model: 'text-embedding-3-small',
    });
  }

  getRetrieverTool(
    resourceId: string,
    resourceType: ChromaDBResourceType,
    resourceName: string,
    resourceDescription: string,
  ): ReturnType<typeof createRetrieverTool> {
    const vectorStore = new Chroma(this.embeddings, {
      collectionName: this._getCollectionName(resourceId, resourceType),
      url: process.env.CHROMA_URL,
    });

    const retriever = vectorStore.asRetriever({
      k: 5,
    });

    return createRetrieverTool(retriever, {
      name: `${resourceName} Agent`,
      description: `Retrieves relevant information for ${resourceName} agent based on the provided query. Agent is for ${resourceDescription}`,
    });
  }

  async addDocumentToCollection(
    resourceId: string,
    resourceType: ChromaDBResourceType,
    documents: Document[],
  ) {
    const vectorStore = new Chroma(this.embeddings, {
      collectionName: this._getCollectionName(resourceId, resourceType),
      url: process.env.CHROMA_URL,
    });
    await vectorStore.addDocuments(documents);
  }

  async queryCollection(
    resourceId: string,
    resourceType: ChromaDBResourceType,
    query: string,
  ) {
    const vectorStore = new Chroma(this.embeddings, {
      collectionName: this._getCollectionName(resourceId, resourceType),
      url: process.env.CHROMA_URL,
    });

    const results = await vectorStore.similaritySearch(query);
    return results;
  }

  // =================== private methods================
  private _getCollectionName(
    resourceId: string,
    resourceType: ChromaDBResourceType,
  ): string {
    return `${resourceType}_${resourceId}`;
  }
}
