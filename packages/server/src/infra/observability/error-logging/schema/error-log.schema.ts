import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ErrorLog extends Document {
  @Prop({ required: true })
  statusCode: number;
  @Prop({ required: true })
  error: string;
  @Prop({ required: true })
  message: string;
  @Prop({ index: true })
  userId?: string;
  @Prop()
  stack?: string;
  @Prop()
  request?: string;
}

export const ErrorLogSchema = SchemaFactory.createForClass(ErrorLog);
