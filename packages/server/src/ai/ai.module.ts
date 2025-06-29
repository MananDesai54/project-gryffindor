import { Module } from '@nestjs/common';
import { AiAgentService } from './service/aiAgent.service';
import { AiController } from './ai.controller';
import { AiAgentSchemaModule } from './schema/aiAgent.schema';
import { AiToolSchemaModule } from './schema/aiTool.schema';
import { KnowledgeBaseSchemaModule } from './schema/knowledgeBase.schema';
import { LLMSchemaModule } from './schema/llm.schema';
import { InternalModule } from './internal/internal.module';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { AiToolService } from './service/ai-tool.service';
import { LlmService } from './service/llm.service';
import { KnowledgeBaseService } from './service/knowledge-base.service';

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
