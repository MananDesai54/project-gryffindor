import { Chroma } from '@langchain/community/vectorstores/chroma';
import { Document } from '@langchain/core/documents';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { ChromaClient } from 'chromadb';
import { createRetrieverTool } from 'langchain/tools/retriever';

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

  getRetrieverForAgent(
    agentId: string,
    agentName: string,
    agentDescription: string,
  ): ReturnType<typeof createRetrieverTool> {
    const vectorStore = new Chroma(this.embeddings, {
      collectionName: `agent_${agentId}`,
      url: process.env.CHROMA_URL,
    });

    const retriever = vectorStore.asRetriever({
      k: 5,
    });

    return createRetrieverTool(retriever, {
      name: `${agentName} Agent`,
      description: `Retrieves relevant information for ${agentName} agent based on the provided query. Agent is for ${agentDescription}`,
    });
  }

  async addDocumentToAgentCollection(agentId: string, documents: Document[]) {
    const vectorStore = new Chroma(this.embeddings, {
      collectionName: `agent_${agentId}`,
      url: process.env.CHROMA_URL,
    });
    await vectorStore.addDocuments(documents);
  }

  async queryAgentCollection(agentId: string, query: string) {
    const vectorStore = new Chroma(this.embeddings, {
      collectionName: `agent_${agentId}`,
      url: process.env.CHROMA_URL,
    });

    const results = await vectorStore.similaritySearch(query);
    return results;
  }
}
