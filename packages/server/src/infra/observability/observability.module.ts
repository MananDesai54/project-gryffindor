import { Module } from '@nestjs/common';
import { LangfuseModule } from './langfuse/langfuse.module';

@Module({
  imports: [LangfuseModule]
})
export class ObservabilityModule {}
