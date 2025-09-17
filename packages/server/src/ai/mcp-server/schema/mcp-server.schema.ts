import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ApiParamsValueSchema } from 'src/ai/ai-tool/schema/ai-tool.schema';
import { MCPServerApprovalPolicy } from '../types/mcp-server.type';

@Schema({ timestamps: true })
export class MCPServer {
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: String, enum: MCPServerApprovalPolicy })
  approvalPolicy: MCPServerApprovalPolicy;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true, default: 'SSE' })
  transport: string;

  @Prop({ type: [ApiParamsValueSchema] })
  requestHeaders?: ApiParamsValueSchema[];

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: string;
}

export const MCPServerSchema = SchemaFactory.createForClass(MCPServer);
