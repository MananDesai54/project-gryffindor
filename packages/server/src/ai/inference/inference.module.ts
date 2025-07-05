import { Module } from '@nestjs/common';
import { InferenceService } from './inference.service';
import { InferenceController } from './inference.controller';
import { AgentFactoryService } from './agent-factory/agent-factory.service';
import { LlmFactoryService } from './llm-factory/llm-factory.service';
import { ToolFactoryService } from './tool-factory/tool-factory.service';
import { HistoryService } from './history/history.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ChatMessageHistory,
  ChatMessageHistorySchema,
} from './history/schema/history.schema';
import { ChromadbModule } from 'src/infra/chromadb/chromadb.module';
import { AiAgentModule } from '../ai-agent/ai-agent.module';
import { LlmModule } from '../llm/llm.module';
import { AiToolModule } from '../ai-tool/ai-tool.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatMessageHistory.name, schema: ChatMessageHistorySchema },
    ]),
    ChromadbModule,
    AiAgentModule,
    LlmModule,
    AiToolModule,
  ],
  providers: [
    InferenceService,
    AgentFactoryService,
    LlmFactoryService,
    ToolFactoryService,
    HistoryService,
  ],
  controllers: [InferenceController],
})
export class InferenceModule {}
