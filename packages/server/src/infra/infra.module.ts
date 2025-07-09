import { Module } from '@nestjs/common';
import { ChromadbModule } from './chromadb/chromadb.module';
import { MongoModule } from './mongo/mongo.module';
import { ObservabilityModule } from './observability/observability.module';

@Module({
  imports: [MongoModule, ObservabilityModule, ChromadbModule],
  // imports: [MongoModule, ObservabilityModule, ChromadbModule, MessagingModule],
})
export class InfraModule {
  // private readonly logger = new Logger(InfraModule.name);
  // constructor(
  //   @Inject(MessagingConstant.MESSAGING_PRODUCER_SERVICE)
  //   private readonly messagingProducerService: ClientKafka,
  // ) {}
  // async onModuleInit() {
  //   try {
  //     await this.messagingProducerService.connect();
  //     this.logger.log('Connected to messaging producer');
  //   } catch (error) {
  //     this.logger.error('Failed to connect to messaging producer', error);
  //   }
  // }
}
