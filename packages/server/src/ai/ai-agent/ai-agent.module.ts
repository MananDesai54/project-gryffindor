import { Module } from '@nestjs/common';
import { AiAgentController } from './ai-agent.controller';
import { AiAgentService } from './ai-agent.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AiAgent, AiAgentSchema } from './schema/ai-agent.schema';
import { AiAgentFactory } from './factory/ai-agent.factory';
import { ChromadbModule } from '../../infra/chromadb/chromadb.module';
import { LlmModule } from '../llm/llm.module';
import { AiToolModule } from '../ai-tool/ai-tool.module';
import { KnowledgeBaseModule } from '../knowledge-base/knowledge-base.module';
import { AiAgentKnowledgeBaseIngestionConsumer } from './consumer/aiAgentKnowledgeBaseIngestion.consumer';
import { MessagingModule } from '../../infra/messaging/messaging.module';
import { AiAgentKnowledgeBaseFactory } from './factory/ai-agent-knowledge-base.fcatory';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AiAgent.name, schema: AiAgentSchema }]),
    ChromadbModule,
    LlmModule,
    AiToolModule,
    KnowledgeBaseModule,
    MessagingModule,
  ],
  controllers: [AiAgentController, AiAgentKnowledgeBaseIngestionConsumer],
  providers: [AiAgentService, AiAgentFactory, AiAgentKnowledgeBaseFactory],
  exports: [AiAgentService, AiAgentFactory],
})
export class AiAgentModule {}
