import { Module } from '@nestjs/common';
import { AiInternalController } from './ai-internal.controller';
import { AiInternalService } from './ai-internal.service';
import { LLMSchemaModule } from '../schema/llm.schema';

@Module({
  imports: [LLMSchemaModule],
  controllers: [AiInternalController],
  providers: [AiInternalService],
})
export class AiInternalModule {}
