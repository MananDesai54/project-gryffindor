import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class ChatMessageHistory extends Document {
  @Prop({ required: true, index: true })
  sessionId: string;

  // LangChain will manage the content of this array.
  // We define it as a flexible array of objects.
  @Prop({ type: Array, required: true })
  History: Record<string, any>[];
}

export const ChatMessageHistorySchema =
  SchemaFactory.createForClass(ChatMessageHistory);
