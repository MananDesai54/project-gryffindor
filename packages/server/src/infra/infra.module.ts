import { Module } from '@nestjs/common';
import { ChromadbModule } from './chromadb/chromadb.module';
import { InfraService } from './infra.service';
import { MessagingModule } from './messaging/messaging.module';
import { MongoModule } from './mongo/mongo.module';
import { ObservabilityModule } from './observability/observability.module';

@Module({
  imports: [MongoModule, ObservabilityModule, ChromadbModule, MessagingModule],
  providers: [InfraService],
  exports: [InfraService],
})
export class InfraModule {}
