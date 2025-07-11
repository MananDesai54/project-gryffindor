import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MessagingConstant } from './constant/messaging.constant';
import { MessagingProducerService } from './messaging-producer.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MessagingConstant.MESSAGING_PRODUCER_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'kafka-producer',
            brokers: [process.env.KAFKA_BROKER_URL],
            connectionTimeout: 5000,
            requestTimeout: 30000,
            retry: {
              initialRetryTime: 300,
              retries: 5,
            },
          },
          producer: {
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
  ],
  providers: [MessagingProducerService],
  exports: [MessagingProducerService],
})
export class MessagingModule {}
