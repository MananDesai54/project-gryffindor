import { Inject, Logger, Module, OnModuleInit } from '@nestjs/common';
import { ChromadbModule } from './chromadb/chromadb.module';
import { MessagingProducerService } from './messaging/messaging-producer.service';
import { MessagingModule } from './messaging/messaging.module';
import { MongoModule } from './mongo/mongo.module';
import { ObservabilityModule } from './observability/observability.module';

@Module({
  imports: [MongoModule, ObservabilityModule, ChromadbModule, MessagingModule],
})
export class InfraModule implements OnModuleInit {
  private readonly logger = new Logger(InfraModule.name);

  constructor(
    @Inject()
    private readonly messagingProducerService: MessagingProducerService,
  ) {}

  async onModuleInit() {
    this.logger.log('Infra INITIALIZING');
    await this.messagingProducerService.connectProducer();
    this.logger.log('Infra INITIALIZED and READY');
  }
}
