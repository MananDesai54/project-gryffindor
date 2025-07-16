import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

export type AiWorkflowDocument = HydratedDocument<AIWorkflow>;

export class AIWorkflowXYPosition {
  @Prop()
  x: number;

  @Prop()
  y: number;
}

export class AiWorkflowViewport extends AIWorkflowXYPosition {
  @Prop()
  zoom: number;
}

export class AiWorkflowNodeData {
  @Prop({ required: true })
  id: string;
  // category: AiWorkflowNodeCategory;
  // type: AiWorkflowNodeType;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description?: string;
}

export class AiWorkflowNode {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true, type: AIWorkflowXYPosition })
  position: AIWorkflowXYPosition;

  @Prop({ type: AiWorkflowNodeData })
  data: AiWorkflowNodeData;
}

export class AiWorkflowEdge {}

export class AIWorkflowData {
  @Prop({ required: true, type: [AiWorkflowNode] })
  nodes: Array<AiWorkflowNode>;

  @Prop({ required: true, type: [AiWorkflowEdge] })
  edges: Array<AiWorkflowEdge>;

  @Prop({ required: true, type: AiWorkflowViewport })
  viewport: AiWorkflowViewport;
}

@Schema({ timestamps: true })
export class AIWorkflow extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: string;

  @Prop({ type: AIWorkflowData })
  data: AIWorkflowData;
}

export const AiWorkflowSchema = SchemaFactory.createForClass(AIWorkflow);
