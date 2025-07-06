import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KnowledgeBaseController } from './knowledge-base.controller';
import { KnowledgeBaseService } from './knowledge-base.service';
import {
  KnowledgeBase,
  KnowledgeBaseSchema,
} from './schema/knowledge-base.schema';
import { KnowledgeBaseFactory } from './factory/knowledge-base.factory';
import { ChromadbModule } from '../../infra/chromadb/chromadb.module';
import { FileModule } from '../../file/file.module';
import { KnowbaseContentExtractorService } from './knowbase-content-extractor.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: KnowledgeBase.name,
        schema: KnowledgeBaseSchema,
      },
    ]),
    ChromadbModule,
    FileModule,
  ],
  controllers: [KnowledgeBaseController],
  providers: [
    KnowledgeBaseService,
    KnowledgeBaseFactory,
    KnowbaseContentExtractorService,
  ],
  exports: [
    KnowledgeBaseService,
    KnowledgeBaseFactory,
    KnowbaseContentExtractorService,
  ],
})
export class KnowledgeBaseModule {}
