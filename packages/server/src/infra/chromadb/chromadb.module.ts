import { Module } from '@nestjs/common';
import { ChromadbService } from './chromadb.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RAGIndex, RAGIndexSchema } from './schema/ragIndex.schema';
import { ChromaDbFactory } from './factory/chromadb.factory';
import { RAGIndexService } from './ragIndex.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RAGIndex.name,
        schema: RAGIndexSchema,
      },
    ]),
  ],
  providers: [ChromadbService, ChromaDbFactory, RAGIndexService],
  exports: [ChromadbService, ChromaDbFactory, RAGIndexService],
})
export class ChromadbModule {}
