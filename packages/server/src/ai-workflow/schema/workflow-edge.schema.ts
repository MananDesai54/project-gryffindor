import { Prop } from '@nestjs/mongoose';

export class AiWorkflowEdge {
  @Prop({ type: String, required: true })
  id: string;

  @Prop({ type: String, required: true })
  source: string;

  @Prop({ type: String, required: true })
  target: string;

  @Prop({ type: String, required: true })
  sourceHandle: string;

  @Prop({ type: String, required: true })
  targetHandle: string;

  @Prop({ type: String })
  type?: string; // for Ui
}
