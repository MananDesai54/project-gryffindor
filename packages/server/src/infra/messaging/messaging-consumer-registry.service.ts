/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { forEach } from 'lodash';
import {
  MESSAGING_CONSUMER_METHOD,
  MESSAGING_TOPIC_METADATA,
} from './decorators/messaging-consumer.decorator';

export interface MessagingConsumer {
  topic: string;
  callback: (payload: any) => Promise<void>;
}

@Injectable()
export class MessagingConsumerRegistryService implements OnModuleInit {
  private readonly logger = new Logger(MessagingConsumerRegistryService.name);
  private readonly consumers = new Map<string, MessagingConsumer>();

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    this._registerConsumers();
  }

  private _registerConsumers() {
    const providers: InstanceWrapper[] = this.discoveryService.getProviders();

    forEach(providers, (provider: InstanceWrapper) => {
      const { instance } = provider;
      if (!instance || !Object.getPrototypeOf(instance)) {
        return;
      }

      const allmethodNames = this.metadataScanner.getAllMethodNames(
        Object.getPrototypeOf(instance),
      );
      forEach(allmethodNames, (methodName) => {
        const isConsumer = this.reflector.get<boolean>(
          MESSAGING_CONSUMER_METHOD,
          instance[methodName],
        );
        if (isConsumer) {
          const topic = this.reflector.get<string>(
            MESSAGING_TOPIC_METADATA,
            instance[methodName],
          );
          this.consumers.set(`${topic}-${methodName}`, {
            topic,
            callback: instance[methodName].bind(instance),
          });
          this.logger.log(
            `Discovered Kafka consumer for topic "${topic}" on method "${methodName}"`,
          );
        }
      });
    });
  }

  getConsumers() {
    return Array.from(this.consumers.values());
  }

  getAllTopics() {
    return Array.from(this.consumers.values()).map(
      (consumer) => consumer.topic,
    );
  }
}
