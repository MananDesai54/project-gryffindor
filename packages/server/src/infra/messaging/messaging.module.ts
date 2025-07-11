import { Global, Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { MessagingConsumerRegistryService } from './messaging-consumer-registry.service';
import { DiscoveryModule } from '@nestjs/core';

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [MessagingService, MessagingConsumerRegistryService],
  exports: [MessagingService],
})
export class MessagingModule {}
