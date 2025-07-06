import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../../user/schema/user.schema';
import { Status } from 'src/core/types/status';

export type KnowledgeBaseDocument = HydratedDocument<KnowledgeBase>;

@Schema({ timestamps: true })
export class KnowledgeBase {
  _id: string;
  @Prop({ required: true })
  type: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: User;
  @Prop()
  content: string;
  @Prop()
  url: string;
  @Prop()
  mimeType: string;
  @Prop({ required: true, default: Status.Pending })
  sourceContentStatus: string;
}

export const KnowledgeBaseSchema = SchemaFactory.createForClass(KnowledgeBase);
