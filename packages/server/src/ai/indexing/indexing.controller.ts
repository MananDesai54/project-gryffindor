import { Controller, Get, Param } from '@nestjs/common';
import { AiAgentService } from '../ai-agent/ai-agent.service';
import { KnowledgeBaseService } from '../knowledge-base/knowledge-base.service';
import { IndexingService } from './indexing.service';

@Controller('indexing')
export class IndexingController {
  constructor(
    private readonly aiAgentService: AiAgentService,
    private readonly knowledgeBaseService: KnowledgeBaseService,
    private readonly indexingService: IndexingService,
  ) {}

  @Get('/index/add-document/:agentId')
  async addDocumentToAgentCollection(@Param('agentId') agentId: string) {
    const aiAgent = await this.aiAgentService.read(agentId);
    const kbs = aiAgent.configuration?.knowledgeBase?.length
      ? await this.knowledgeBaseService.findMany(
          aiAgent.configuration?.knowledgeBase,
        )
      : [];
    return this.indexingService.triggerIndexing(agentId, kbs);
  }
}
