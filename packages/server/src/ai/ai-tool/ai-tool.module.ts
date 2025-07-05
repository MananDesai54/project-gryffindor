import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiToolController } from './ai-tool.controller';
import { AiToolService } from './ai-tool.service';
import {
  AgentAiToolSchema,
  AiTool,
  AiToolSchema,
  WebhookAiToolSchema,
} from './schema/ai-tool.schema';
import { AiToolType } from './types/ai-tool.type';
import { AiToolFactory } from './factory/ai-tool.factory';

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
  providers: [AiToolService, AiToolFactory],
  exports: [AiToolService, AiToolFactory],
})
export class AiToolModule {}
