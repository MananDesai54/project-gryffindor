import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class InjexingConsumer {
  private readonly logger = new Logger(InjexingConsumer.name);

  @MessagePattern('indexing-job')
  consume(message: string) {
    this.logger.log(`[Received Message] ${message}`);
  }
}
