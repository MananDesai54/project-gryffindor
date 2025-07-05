import { Module } from '@nestjs/common';
import { AiAgentController } from './ai-agent.controller';
import { AiAgentService } from './ai-agent.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AiAgent, AiAgentSchema } from './schema/ai-agent.schema';
import { AiAgentFactory } from './factory/ai-agent.factory';
import { ChromadbModule } from '../../infra/chromadb/chromadb.module';
import { LlmModule } from '../llm/llm.module';
import { AiToolModule } from '../ai-tool/ai-tool.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AiAgent.name, schema: AiAgentSchema }]),
    ChromadbModule,
    LlmModule,
    AiToolModule,
  ],
  controllers: [AiAgentController],
  providers: [AiAgentService, AiAgentFactory],
  exports: [AiAgentService, AiAgentFactory],
})
export class AiAgentModule {}
