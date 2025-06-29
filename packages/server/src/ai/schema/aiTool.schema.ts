import {
  MongooseModule,
  Prop,
  raw,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { AiToolType } from '../types/ai';
import { AiConstants } from '../constant/ai.constant';

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
  creator: User;
}

export class ApiParamsValueSchema {
  @Prop({ required: true, unique: true })
  name: string;
  @Prop({ required: true })
  datatype: string;
  @Prop()
  description: string;
  @Prop({ required: true })
  valueType: string;
  @Prop({ required: true })
  value: string;
}

export class WebhookApiSchema {
  @Prop({ required: true })
  url: string;
  @Prop({ required: true })
  method: string;
  @Prop()
  headers: ApiParamsValueSchema[];
  @Prop()
  pathParam: ApiParamsValueSchema[];
  @Prop()
  queryParams: ApiParamsValueSchema[];
  @Prop()
  body: ApiParamsValueSchema[];
}

@Schema()
export class WebhookAiTool extends AiTool {
  @Prop(raw({}))
  dynamicVariables: Record<string, string>;
  @Prop({ default: AiConstants.AI_WEB_HOOK_TOOL_DEFAULT_REQ_TIMEOUT })
  reqTimeout: number;
  @Prop()
  apiSchema: WebhookApiSchema;
}

@Schema()
export class AgentAiTool extends AiTool {
  @Prop({ required: true })
  agentId: string;
}

export const AiToolSchema = SchemaFactory.createForClass(AiTool);
export const WebhookAiToolSchema = SchemaFactory.createForClass(WebhookAiTool);
export const AgentAiToolSchema = SchemaFactory.createForClass(AgentAiTool);

export const AiToolSchemaModule = MongooseModule.forFeature([
  {
    name: AiTool.name,
    schema: AiToolSchema,
    discriminators: [
      {
        name: AiToolType.WEB_HOOK,
        schema: WebhookAiToolSchema,
      },
      {
        name: AiToolType.AGENT,
        schema: AgentAiToolSchema,
      },
    ],
  },
]);
