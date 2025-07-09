import { Controller, Get, Param } from '@nestjs/common';
import { AiAgentService } from '../ai-agent/ai-agent.service';
import { KnowledgeBaseService } from '../knowledge-base/knowledge-base.service';
import { IndexingService } from './indexing.service';

@Controller('ai/index')
export class IndexingController {
  constructor(
    private readonly aiAgentService: AiAgentService,
    private readonly knowledgeBaseService: KnowledgeBaseService,
    private readonly indexingService: IndexingService,
    // @Inject(MessagingConstant.MESSAGING_PRODUCER_SERVICE)
    // private readonly messagingProducerService: ClientKafka,
  ) {}

  @Get('/add-document/:agentId')
  async addDocumentToAgentCollection(@Param('agentId') agentId: string) {
    const aiAgent = await this.aiAgentService.read(agentId);
    // this.messagingProducerService.emit(
    //   'indexing-job',
    //   aiAgent.configuration.knowledgeBase || 'No Knowlegde Base',
    // );
    // return 'Send event';
    const kbs = aiAgent.configuration?.knowledgeBase?.length
      ? await this.knowledgeBaseService.findMany(
          aiAgent.configuration?.knowledgeBase,
        )
      : [];
    return this.indexingService.triggerIndexing(agentId, kbs);
  }
}
