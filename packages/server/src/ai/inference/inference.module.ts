import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiAgentModule } from '../ai-agent/ai-agent.module';
import { HistoryService } from './history/history.service';
import {
  ChatMessageHistory,
  ChatMessageHistorySchema,
} from './history/schema/history.schema';
import { InferenceController } from './inference.controller';
import { InferenceService } from './inference.service';
import { LangfuseModule } from '../../infra/observability/langfuse/langfuse.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatMessageHistory.name, schema: ChatMessageHistorySchema },
    ]),
    AiAgentModule,
    LangfuseModule,
  ],
  providers: [InferenceService, HistoryService],
  controllers: [InferenceController],
})
export class InferenceModule {}
