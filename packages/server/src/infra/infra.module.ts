import { Module } from '@nestjs/common';
import { MongoModule } from './mongo/mongo.module';
import { ObservabilityModule } from './observability/observability.module';
import { ChromadbModule } from './chromadb/chromadb.module';

@Module({
  imports: [MongoModule, ObservabilityModule, ChromadbModule],
})
export class InfraModule {}
