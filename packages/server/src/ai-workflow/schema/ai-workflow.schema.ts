import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { AiWorkflowEdge } from './workflow-edge.schema';
import { AiWorkflowNode, AIWorkflowXYPosition } from './workflow-node.schema';

export type AiWorkflowDocument = HydratedDocument<AIWorkflow>;

class AiWorkflowViewport extends AIWorkflowXYPosition {
  @Prop()
  zoom: number;
}

class AIWorkflowData {
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
  data?: AIWorkflowData;
}

export const AiWorkflowSchema = SchemaFactory.createForClass(AIWorkflow);
