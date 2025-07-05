import { Module } from '@nestjs/common';
import { LlmController } from './llm.controller';
import { LlmService } from './llm.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CustomLLMSchema,
  LLM,
  LLMSchema,
  StandardLLMSchema,
} from './schema/llm.schema';
import { LLMType } from './types/llm.type';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: LLM.name,
        schema: LLMSchema,
        discriminators: [
          {
            name: LLMType.STANDARD,
            schema: StandardLLMSchema,
          },
          {
            name: LLMType.CUSTOM,
            schema: CustomLLMSchema,
          },
        ],
      },
    ]),
  ],
  controllers: [LlmController],
  providers: [LlmService],
  exports: [LlmService],
})
export class LlmModule {}
