import { Module } from '@nestjs/common';
import { AiToolController } from './ai-tool.controller';
import { AiToolService } from './ai-tool.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AgentAiToolSchema,
  AiTool,
  AiToolSchema,
  WebhookAiToolSchema,
} from './schema/ai-tool.schema';
import { AiToolType } from './types/ai-tool.type';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AiTool.name,
        schema: AiToolSchema,
        discriminators: [
          {
            name: AiToolType.WEB_HOOK,
            schema: WebhookAiToolSchema,
          },
          {
            name: AiToolType.AGENT,
            schema: AgentAiToolSchema,
          },
        ],
      },
    ]),
  ],
  controllers: [AiToolController],
  providers: [AiToolService],
  exports: [AiToolService],
})
export class AiToolModule {}
