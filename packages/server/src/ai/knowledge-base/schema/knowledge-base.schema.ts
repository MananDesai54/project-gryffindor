import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Status } from 'src/core/types/status';

export type KnowledgeBaseDocument = HydratedDocument<KnowledgeBase>;

export class SourceContentMetadata {
  @Prop({ default: Status.Pending })
  status: string;
  @Prop({ type: mongoose.Schema.Types.Map })
  metadata: Map<string, any>;
}

@Schema({ timestamps: true })
export class KnowledgeBase {
  _id: string;
  @Prop({ required: true })
  type: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: string;
  @Prop()
  content: string;
  @Prop()
  url: string;
  @Prop()
  mimeType: string;
  @Prop({})
  sourceContentMetadata?: SourceContentMetadata;
  @Prop({ type: Array<mongoose.Schema.Types.ObjectId> })
  dependentAgents: string[];
}

export const KnowledgeBaseSchema = SchemaFactory.createForClass(KnowledgeBase);
