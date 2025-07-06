import { Module } from '@nestjs/common';
import { DummyApiController } from './dummy-api.controller';
import { DummyApiService } from './dummy-api.service';

@Module({
  controllers: [DummyApiController],
  providers: [DummyApiService],
})
export class DummyApiModule {}
