import { Inject, Injectable } from '@nestjs/common';
import { ChromaDbFactory } from '../../../infra/chromadb/factory/chromadb.factory';
import { ChromaDBResourceType } from '../../../infra/chromadb/type/chromadb.type';

@Injectable()
export class KnowledgeBaseFactory {
  constructor(@Inject() private readonly chromadbFactory: ChromaDbFactory) {}

  createAgentKnowledgeBaseTool(
    agentId: string,
    resourceName: string,
    resourceDescription: string,
  ) {
    return this.chromadbFactory.createRetrieverTool(
      agentId,
      ChromaDBResourceType.Agent,
      resourceName,
      resourceDescription,
    );
  }
}
