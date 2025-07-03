import { Module } from '@nestjs/common';
import { StorageModule } from './storage/storage.module';

@Module({
  providers: [],
  imports: [StorageModule],
})
export class CloudModule {}
