import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from '../../file/file.module';
import { KnowbaseContentExtractorService } from './knowbase-content-extractor.service';
import { KnowledgeBaseController } from './knowledge-base.controller';
import { KnowledgeBaseService } from './knowledge-base.service';
import {
  KnowledgeBase,
  KnowledgeBaseSchema,
} from './schema/knowledge-base.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: KnowledgeBase.name,
        schema: KnowledgeBaseSchema,
      },
    ]),
    FileModule,
  ],
  controllers: [KnowledgeBaseController],
  providers: [KnowledgeBaseService, KnowbaseContentExtractorService],
  exports: [KnowledgeBaseService, KnowbaseContentExtractorService],
})
export class KnowledgeBaseModule {}
