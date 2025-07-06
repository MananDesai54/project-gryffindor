import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Status } from 'src/core/types/status';

@Schema({ timestamps: true })
export class RAGIndex {
  _id: string;
  @Prop({ required: true })
  resourceType: string;
  @Prop({ required: true, unique: true })
  resourceId: string;
  @Prop({ required: true, default: 'text-embedding-3-small' })
  model: string;
  @Prop({ required: true })
  indexName: string;
  @Prop({ required: true, default: Status.Pending })
  status: string;
  @Prop()
  usedBytes?: number;
}

export const RAGIndexSchema = SchemaFactory.createForClass(RAGIndex);
