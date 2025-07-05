import { Module } from '@nestjs/common';
import { LangfuseModule } from './langfuse/langfuse.module';
import { ErrorLoggingModule } from './error-logging/error-logging.module';

@Module({
  imports: [LangfuseModule, ErrorLoggingModule],
})
export class ObservabilityModule {}
