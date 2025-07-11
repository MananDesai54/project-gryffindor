import { SetMetadata } from '@nestjs/common';

export const MESSAGING_CONSUMER_METHOD = 'MESSAGING_CONSUMER_METHOD';
export const MESSAGING_TOPIC_METADATA = 'MESSAGING_TOPIC_METADATA';

export const MessagingConsumer = (topic: string) => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    SetMetadata(MESSAGING_CONSUMER_METHOD, true)(target, key, descriptor);
    SetMetadata(MESSAGING_TOPIC_METADATA, topic)(target, key, descriptor);
  };
};
