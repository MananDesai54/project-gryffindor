import { Module } from '@nestjs/common';
import { KnowledgeBaseController } from './knowledge-base.controller';
import { KnowledgeBaseService } from './knowledge-base.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FileKnowledgeBaseSchema,
  KnowledgeBase,
  KnowledgeBaseSchema,
  LinkKnowledgeBaseSchema,
  TextKnowledgeBaseSchema,
} from './schema/knowledge-base.schema';
import { KnowledgeBaseType } from './types/knowledge-base.type';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: KnowledgeBase.name,
        schema: KnowledgeBaseSchema,
        discriminators: [
          {
            name: KnowledgeBaseType.FILE,
            schema: FileKnowledgeBaseSchema,
          },
          {
            name: KnowledgeBaseType.TEXT,
            schema: TextKnowledgeBaseSchema,
          },
          {
            name: KnowledgeBaseType.LINK,
            schema: LinkKnowledgeBaseSchema,
          },
        ],
      },
    ]),
  ],
  controllers: [KnowledgeBaseController],
  providers: [KnowledgeBaseService],
  exports: [KnowledgeBaseService],
})
export class KnowledgeBaseModule {}
