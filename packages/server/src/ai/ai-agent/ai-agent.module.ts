import { Module } from '@nestjs/common';
import { AiAgentController } from './ai-agent.controller';
import { AiAgentService } from './ai-agent.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AiAgent, AiAgentSchema } from './schema/ai-agent.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AiAgent.name, schema: AiAgentSchema }]),
  ],
  controllers: [AiAgentController],
  providers: [AiAgentService],
  exports: [AiAgentService],
})
export class AiAgentModule {}
