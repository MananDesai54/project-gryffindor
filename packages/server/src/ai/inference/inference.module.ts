import { Module } from '@nestjs/common';
import { InferenceController } from './inference.controller';
import { InferenceService } from './inference.service';
import { LlmFactoryModule } from './llm-factory/llm-factory.module';

@Module({
  controllers: [InferenceController],
  providers: [InferenceService],
  imports: [LlmFactoryModule]
})
export class InferenceModule {}
