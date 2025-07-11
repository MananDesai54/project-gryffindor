import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MessagingConstant } from './constant/messaging.constant';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class MessagingProducerService {
  private readonly logger = new Logger(MessagingProducerService.name);
  constructor(
    @Inject(MessagingConstant.MESSAGING_PRODUCER_SERVICE)
    private readonly kafkaClient: ClientKafka,
  ) {}

  async connectProducer() {
    try {
      await this.kafkaClient.connect();
      this.logger.log('Connected to messaging producer');
    } catch (error) {
      this.logger.error('Failed to connect to messaging producer', error);
      throw new InternalServerErrorException(
        error,
        'Failed to connect to messaging producer',
      );
    }
  }

  produce<T>(topic: string, message: T) {
    try {
      this.kafkaClient.emit<T>(topic, message);
      this.logger.log(`Message sent to topic ${topic}`);
    } catch (error) {
      this.logger.error(`Failed to send message to topic ${topic}`, error);
      throw new InternalServerErrorException(
        error,
        `Failed to send message to topic ${topic}`,
      );
    }
  }
}
