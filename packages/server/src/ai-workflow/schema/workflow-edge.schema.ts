import { Prop } from '@nestjs/mongoose';
import {
  AiWorkflowNodeConnectionType,
  AiWorkflowNodeType,
} from '../type/ai-workflow.type';

class AiWorkflowEdgeSourceHandle {
  @Prop({ type: String, required: true })
  id: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  type: AiWorkflowNodeType;

  @Prop({ type: [String], required: true })
  outputTypes: AiWorkflowNodeConnectionType[];
}

class AiWorkflowEdgeTargetHandle {
  @Prop({ type: String, required: true })
  id: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  type: AiWorkflowNodeType;

  @Prop({ type: [String], required: true })
  inputTypes: AiWorkflowNodeConnectionType[];
}

class AiWorkflowEdgeData {
  @Prop({ type: AiWorkflowEdgeSourceHandle, required: true })
  sourceHandle: AiWorkflowEdgeSourceHandle;

  @Prop({ type: AiWorkflowEdgeTargetHandle, required: true })
  targetHandle: AiWorkflowEdgeTargetHandle;
}

export class AiWorkflowEdge {
  @Prop({ type: String, required: true })
  id: string;

  @Prop({ type: String })
  type?: string; // for Ui

  @Prop({ type: String, required: true })
  source: string;

  @Prop({ type: String, required: true })
  target: string;

  @Prop({ type: AiWorkflowEdgeData, required: true })
  data: AiWorkflowEdgeData;
}
