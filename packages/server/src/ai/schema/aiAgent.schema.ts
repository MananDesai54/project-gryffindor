import {
  MongooseModule,
  Prop,
  raw,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { AiTool } from './aiTool.schema';
import { KnowledgeBase } from './knowledgeBase.schema';
import { LLM } from './llm.schema';

export type AiAgentDocument = HydratedDocument<AiAgent>;

class AiAgentConfiguration {
  @Prop()
  firstMessage: string;
  @Prop()
  systemPrompt: string;
  @Prop(raw({}))
  dynamicVariables: Record<string, string>;
  @Prop({ default: 0 })
  temperature: number;
  @Prop({ default: -1 })
  maxTokens: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'KnowledgeBase' })
  knowledgeBase: KnowledgeBase[];
  @Prop()
  builtInTools: string[];
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'AiTool' })
  customTools: AiTool[];
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'LLM' })
  llm: LLM;
}

@Schema({ timestamps: true })
export class AiAgent {
  _id: string;
  @Prop({ required: true })
  name: string;
  @Prop()
  description: string;
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: User;
  @Prop()
  configuration: AiAgentConfiguration;
}

export const AiAgentSchema = SchemaFactory.createForClass(AiAgent);

export const AiAgentSchemaModule = MongooseModule.forFeature([
  { name: AiAgent.name, schema: AiAgentSchema },
]);
