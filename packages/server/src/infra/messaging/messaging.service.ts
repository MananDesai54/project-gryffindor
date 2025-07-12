import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Admin, Consumer, ITopicConfig, Kafka, Producer } from 'kafkajs';
import { MessagingConsumerRegistryService } from './messaging-consumer-registry.service';
import { filter, map } from 'lodash';

// ClientsModule.register([
//   {
//     name: MessagingConstant.MESSAGING_PRODUCER_SERVICE,
//     transport: Transport.KAFKA,
//     options: {
//       client: {
//         clientId: 'kafka-producer',
//         brokers: [process.env.KAFKA_BROKER_URL],
//         connectionTimeout: 5000,
//         requestTimeout: 30000,
//         retry: {
//           initialRetryTime: 300,
//           retries: 5,
//         },
//       },
//       producer: {
//         allowAutoTopicCreation: true,
//       },
//     },
//   },
// ]),

// app.connectMicroservice<MicroserviceOptions>({
//   transport: Transport.KAFKA,
//   options: {
//     client: {
//       clientId: 'kafka-consumer',
//       brokers: [process.env.KAFKA_BROKER_URL],
//       connectionTimeout: 5000,
//       requestTimeout: 30000,
//       retry: {
//         initialRetryTime: 1000,
//         retries: 8,
//         maxRetryTime: 30000,
//       },
//     },
//     consumer: {
//       groupId: 'kafka-consumer',
//       sessionTimeout: 60000,
//     },
//   },
// });

@Injectable()
export class MessagingService {
  private readonly logger = new Logger(MessagingService.name);
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly consumer: Consumer;
  private readonly kafkaAdmin: Admin;

  constructor(
    @Inject()
    private readonly messagingConsumerRegistryService: MessagingConsumerRegistryService,
  ) {
    this.kafka = new Kafka({
      clientId: 'gryffindor-app',
      brokers: [process.env.KAFKA_BROKER_URL],
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: 'gryffindor-consumer',
      sessionTimeout: 60000,
    });
    this.kafkaAdmin = this.kafka.admin();
  }

  async init() {
    await this.connect();
    await this._createTopics();
    await this._runConsumer();
  }

  async connect() {
    try {
      await this.kafkaAdmin.connect();
      await this.producer.connect();
      await this.consumer.connect();
      this.logger.log('Connected to messaging producer and consumer');
    } catch (error) {
      this.logger.error(
        'Failed to connect to messaging producer, consumer',
        error,
      );
      throw new InternalServerErrorException(
        error,
        'Failed to connect to messaging producer',
      );
    }
  }

  async disconnect() {
    try {
      await this.kafkaAdmin.disconnect();
      await this.producer.disconnect();
      await this.consumer.disconnect();
      this.logger.log('Disconnected from messaging producer and consumer');
    } catch (error) {
      this.logger.error(
        'Failed to disconnect from messaging producer, consumer',
        error,
      );
      throw new InternalServerErrorException(
        error,
        'Failed to disconnect from messaging producer and consumer',
      );
    }
  }

  async produce<T>(topic: string, message: T) {
    try {
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });
      this.logger.log(`Message sent to topic ${topic}`);
    } catch (error) {
      this.logger.error(`Failed to send message to topic ${topic}`, error);
      throw new InternalServerErrorException(
        error,
        `Failed to send message to topic ${topic}`,
      );
    }
  }

  // =================== private methods ===================

  private async _createTopics() {
    const topics = this.messagingConsumerRegistryService.getAllTopics();
    if (!topics.length) return;

    this.logger.log(`Creating topics: ${topics.join(', ')}`);

    const topicsConfig: ITopicConfig[] = map(topics, (t) => ({
      topic: t,
      numPartitions: 1,
      replicationFactor: 1,
    }));

    await this.kafkaAdmin.createTopics({
      topics: topicsConfig,
      waitForLeaders: true,
    });

    this.logger.log(`Topics created: ${topics.join(', ')}`);
  }

  private async _runConsumer() {
    const consumers = this.messagingConsumerRegistryService.getConsumers();
    const topics = [...new Set(consumers.map((consumer) => consumer.topic))];

    await this.consumer.subscribe({ topics, fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ message, topic }) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const payload = JSON.parse(message.value?.toString() || '');

        const topicConsumers = filter(consumers, { topic });

        for (const consumer of topicConsumers) {
          try {
            await consumer.callback(payload);
          } catch (error) {
            this.logger.error(
              `Failed to process message from topic ${topic}`,
              error,
            );
          }
        }
      },
    });
  }
}
