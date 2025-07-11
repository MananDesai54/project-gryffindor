import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { AiToolConstants } from '../../ai-tool/constant/ai.constant';

export type AiToolDocument = HydratedDocument<AiTool>;

@Schema({ timestamps: true, discriminatorKey: 'type' })
export class AiTool {
  _id: string;
  type: string; // just for typescript
  @Prop({ required: true })
  name: string;
  @Prop()
  description: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: string;
  @Prop({ required: false })
  isStandard?: boolean;
}

export class ApiParamsValueSchema {
  @Prop({ required: true, unique: true })
  name: string;
  @Prop({ required: true })
  datatype: string;
  @Prop()
  description?: string;
  @Prop({ required: true })
  valueType: string;
  @Prop({ required: true })
  value: string;
}

export class WebhookBodySchema {
  @Prop({ required: true })
  description: string;
  @Prop({ required: true, type: [ApiParamsValueSchema] })
  payloadParams: ApiParamsValueSchema[];
}

export class WebhookApiSchema {
  @Prop({ required: true })
  url: string;
  @Prop({ required: true })
  method: string;
  @Prop()
  headers?: ApiParamsValueSchema[];
  @Prop()
  pathParams?: ApiParamsValueSchema[];
  @Prop()
  queryParams?: ApiParamsValueSchema[];
  @Prop()
  body?: WebhookBodySchema;
}

@Schema()
export class WebhookAiTool extends AiTool {
  @Prop({
    type: mongoose.Schema.Types.Map,
    of: String,
    required: false,
  })
  dynamicVariables?: Record<string, string>;
  @Prop({ default: AiToolConstants.AI_WEB_HOOK_TOOL_DEFAULT_REQ_TIMEOUT })
  reqTimeout?: number;
  @Prop({ required: true })
  apiSchema: WebhookApiSchema;
}

@Schema()
export class AgentAiTool extends AiTool {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AiAgent',
  })
  agentId: string;
}

export const AiToolSchema = SchemaFactory.createForClass(AiTool);
export const WebhookAiToolSchema = SchemaFactory.createForClass(WebhookAiTool);
export const AgentAiToolSchema = SchemaFactory.createForClass(AgentAiTool);
