import { Chroma } from '@langchain/community/vectorstores/chroma';
import { Document } from '@langchain/core/documents';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { ChromaClient } from 'chromadb';
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

  async addDocumentToCollection(
    resourceId: string,
    resourceType: ChromaDBResourceType,
    documents: Document[],
  ) {
    const vectorStore = new Chroma(this.embeddings, {
      collectionName: this._getCollectionName(resourceId, resourceType),
      url: process.env.CHROMA_URL,
    });
    const result = await vectorStore.addDocuments(documents);
    return result;
  }

  async deleteDocuments(
    resourceId: string,
    resourceType: ChromaDBResourceType,
    documentIds: string[],
  ) {
    const vectorStore = new Chroma(this.embeddings, {
      collectionName: this._getCollectionName(resourceId, resourceType),
      url: process.env.CHROMA_URL,
    });
    const result = await vectorStore.delete({ ids: documentIds });
    return result;
  }

  async deleteAllCollections() {
    const collections = await this.chromaClient.listCollections();
    await Promise.all(
      collections.map((collection) =>
        this.chromaClient.deleteCollection({ name: collection.id }),
      ),
    );
  }

  async queryCollection(
    resourceId: string,
    resourceType: ChromaDBResourceType,
    query: string,
  ) {
    // const queryVector = await this.embeddings.embedQuery(query);

    // const vectorStore = new Chroma(this.embeddings, {
    //   collectionName: this._getCollectionName(resourceId, resourceType),
    //   url: process.env.CHROMA_URL,
    // });

    // const results = await vectorStore.similaritySearchVectorWithScore(
    //   queryVector,
    //   5,
    // );
    // return results;

    const collection = await this.chromaClient.getCollection({
      name: this._getCollectionName(resourceId, resourceType),
      embeddingFunction: {
        generate: (query) => {
          return this.embeddings.embedDocuments(query);
        },
      },
    });

    const results = collection.query({
      queryTexts: [query],
      nResults: 5,
    });

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
