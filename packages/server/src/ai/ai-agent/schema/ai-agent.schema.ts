import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type AiAgentDocument = HydratedDocument<AiAgent>;

class AiAgentConfiguration {
  @Prop()
  firstMessage?: string;
  @Prop()
  systemPrompt: string;
  @Prop({
    type: mongoose.Schema.Types.Map,
    of: String,
    required: false,
  })
  dynamicVariables?: Record<string, string>;
  @Prop({ default: 0 })
  temperature?: number;
  @Prop({ default: -1 })
  maxTokens?: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'KnowledgeBase' })
  knowledgeBase?: string[];
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'MCPServer' })
  mcpServerIds?: string[];
  @Prop()
  builtInTools?: string[];
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'AiTool' })
  customTools?: string[];
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'LLM' })
  llm: string;
}

@Schema({ timestamps: true })
export class AiAgent {
  _id: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: string;
  @Prop()
  configuration: AiAgentConfiguration;
}

export const AiAgentSchema = SchemaFactory.createForClass(AiAgent);
