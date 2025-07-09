import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MessagingConstant } from './constant/messaging.constant';

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
            connectionTimeout: 10000,
          },
          producer: {
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class MessagingModule {}
