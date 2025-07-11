import { Inject, Injectable, Logger } from '@nestjs/common';
import { MessagingService } from './messaging/messaging.service';

@Injectable()
export class InfraService {
  private readonly logger = new Logger(InfraService.name);

  constructor(
    @Inject()
    private readonly messagingService: MessagingService,
  ) {}

  async initInfra() {
    this.logger.log('Infra INITIALIZING');
    await this.messagingService.init();
    this.logger.log('Infra INITIALIZED and READY');
  }

  async destroyInfra() {
    this.logger.log('Infra destroyInfra');
    await this.messagingService.disconnect();
    this.logger.log('Infra DESTROYED');
  }
}
