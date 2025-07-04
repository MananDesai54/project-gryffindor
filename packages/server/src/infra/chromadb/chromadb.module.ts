import { Module } from '@nestjs/common';
import { ChromadbService } from './chromadb.service';

@Module({
  providers: [ChromadbService],
})
export class ChromadbModule {}
