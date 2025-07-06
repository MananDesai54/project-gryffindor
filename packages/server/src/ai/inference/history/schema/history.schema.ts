import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  expires: '2d',
})
export class ChatMessageHistory extends Document {
  @Prop({ required: true, index: true })
  sessionId: string;
  @Prop({ type: Array, required: true })
  messages: any[];
}

export const ChatMessageHistorySchema =
  SchemaFactory.createForClass(ChatMessageHistory);
