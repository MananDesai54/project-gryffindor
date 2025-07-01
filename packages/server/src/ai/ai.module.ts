import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { InternalModule } from './internal/internal.module';
import { AiAgentSchemaModule } from './schema/aiAgent.schema';
import { AiToolSchemaModule } from './schema/aiTool.schema';
import { KnowledgeBaseSchemaModule } from './schema/knowledgeBase.schema';
import { LLMSchemaModule } from './schema/llm.schema';
import { AiToolService } from './service/ai-tool.service';
import { AiAgentService } from './service/aiAgent.service';
import { KnowledgeBaseService } from './service/knowledge-base.service';
import { LlmService } from './service/llm.service';

@Module({
  imports: [
    AiAgentSchemaModule,
    AiToolSchemaModule,
    KnowledgeBaseSchemaModule,
    LLMSchemaModule,
    InternalModule,
  ],
  providers: [AiAgentService, AiToolService, LlmService, KnowledgeBaseService],
  controllers: [AiController],
  exports: [
    AiAgentSchemaModule,
    AiToolSchemaModule,
    KnowledgeBaseSchemaModule,
    LLMSchemaModule,
  ],
})
export class AiModule {}
