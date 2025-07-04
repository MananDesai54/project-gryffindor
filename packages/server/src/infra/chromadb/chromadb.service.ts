import { Chroma } from '@langchain/community/vectorstores/chroma';
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
      path: process.env.CHROMA_URL,
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
  ) {
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
}
