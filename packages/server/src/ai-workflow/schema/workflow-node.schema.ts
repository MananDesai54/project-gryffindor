import { Prop } from '@nestjs/mongoose';
import { values } from 'lodash';
import mongoose from 'mongoose';
import {
  AiWorkflowNodeCategory,
  AiWorkflowNodeConnectionType,
  AiWorkflowNodeInputFieldValueType,
  AiWorkflowNodeType,
} from '../type/ai-workflow.type';

export class AIWorkflowXYPosition {
  @Prop()
  x: number;

  @Prop()
  y: number;
}

class AiWorkflowNodeInputField {
  @Prop({ required: true })
  id: string;

  @Prop({
    required: true,
    enum: values(AiWorkflowNodeConnectionType),
    type: String,
  })
  type: AiWorkflowNodeConnectionType;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ enum: values(AiWorkflowNodeInputFieldValueType), type: String })
  valueType?: AiWorkflowNodeInputFieldValueType;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  defaultValue?: any;

  @Prop({ type: [AiWorkflowNodeConnectionType] })
  injectInputTypes?: AiWorkflowNodeConnectionType[];

  @Prop({ type: [String] })
  options?: string[];

  @Prop({ type: mongoose.Schema.Types.Mixed })
  value?: any;

  @Prop({ type: mongoose.Schema.Types.Boolean })
  toolMode?: boolean;

  @Prop()
  placeholder?: string;

  @Prop({ type: mongoose.Schema.Types.Boolean })
  required?: boolean;

  @Prop({ type: mongoose.Schema.Types.Boolean })
  disabled?: boolean;
}

class AiWorkflowNodeOutput {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true, type: [AiWorkflowNodeConnectionType] })
  outputTypes: AiWorkflowNodeConnectionType[];

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: mongoose.Schema.Types.Boolean })
  toolMode?: boolean;
}

class AiWorkflowNodeMetadata {
  @Prop({ type: [String] })
  fieldOrder?: string[];

  @Prop({
    type: mongoose.Schema.Types.Map,
    of: AiWorkflowNodeInputField,
    required: false,
  })
  inputFields?: Record<string, AiWorkflowNodeInputField>;

  @Prop({ type: [AiWorkflowNodeOutput] })
  outputs?: Array<AiWorkflowNodeOutput>;
}

class AiWorkflowNodeData {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true, enum: values(AiWorkflowNodeCategory), type: String })
  category: AiWorkflowNodeCategory;

  @Prop({ required: true, enum: values(AiWorkflowNodeType), type: String })
  type: AiWorkflowNodeType;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description?: string;

  @Prop({ type: AiWorkflowNodeMetadata, required: true })
  node: AiWorkflowNodeMetadata;
}

export class AiWorkflowNode {
  @Prop({ required: true })
  id: string;

  @Prop({ type: String })
  type: string; // For Ui

  @Prop({ required: true, type: AIWorkflowXYPosition })
  position: AIWorkflowXYPosition;

  @Prop({ type: AiWorkflowNodeData })
  data?: AiWorkflowNodeData;
}
