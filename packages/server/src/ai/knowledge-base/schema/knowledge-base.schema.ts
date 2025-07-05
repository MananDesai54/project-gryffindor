import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../../user/schema/user.schema';

export type KnowledgeBaseDocument = HydratedDocument<KnowledgeBase>;

@Schema({ timestamps: true, discriminatorKey: 'type' })
export class KnowledgeBase {
  _id: string;
  type: string; // just for typescript
  @Prop({ required: true })
  name: string;
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: User;
}

@Schema()
export class TextKnowledgeBase extends KnowledgeBase {
  @Prop({ required: true })
  content: string;
}

@Schema()
export class LinkKnowledgeBase extends KnowledgeBase {
  @Prop({ required: true })
  url: string;
}

@Schema()
export class FileKnowledgeBase extends KnowledgeBase {
  @Prop({ required: true })
  mimeType: string;
  @Prop({ required: true })
  url: string;
}

export const KnowledgeBaseSchema = SchemaFactory.createForClass(KnowledgeBase);
export const FileKnowledgeBaseSchema =
  SchemaFactory.createForClass(FileKnowledgeBase);
export const TextKnowledgeBaseSchema =
  SchemaFactory.createForClass(TextKnowledgeBase);
export const LinkKnowledgeBaseSchema =
  SchemaFactory.createForClass(LinkKnowledgeBase);
