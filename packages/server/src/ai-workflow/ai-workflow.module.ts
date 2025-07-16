import { Module } from '@nestjs/common';
import { AiWorkflowService } from './ai-workflow.service';
import { AiWorkflowController } from './ai-workflow.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AIWorkflow, AiWorkflowSchema } from './schema/ai.workflow.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AIWorkflow.name,
        schema: AiWorkflowSchema,
      },
    ]),
  ],
  providers: [AiWorkflowService],
  controllers: [AiWorkflowController],
})
export class AiWorkflowModule {}
