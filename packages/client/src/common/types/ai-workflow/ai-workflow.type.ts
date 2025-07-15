import { Edge, Node, Viewport } from "@xyflow/react";
import { DbDocument } from "../dbDocument.type";

export enum AiWorkflowComponentCategory {
  IO = "io",
  LLM = "llm",
  Agent = "agent",
  Data = "data",
}

export enum AiWorkflowComponentType {
  ChatInput = "chatInput",
  ChatOutput = "chatOutput",
  TextInput = "textInput",
  TextOutput = "textOutput",

  Agent = "agent",
  LLM = "llm",

  URL = "url",
  File = "file",
  WebSearch = "webSearch",
  WebApi = "webApi",
}

export enum AiWorkflowNodeInputFieldType {
  string = "string",
  tool = "tool",
}

export enum AiWorkflowNodeInputFieldValueType {
  string = "string",
  number = "number",
  boolean = "boolean",
  array = "array",
  object = "object",
}

export enum AiWorkflowNodeOutputType {
  Message = "message",
  Tool = "tool",
}

export interface AiWorkflowNodeInputField {
  id: string;
  type: AiWorkflowNodeInputFieldType;
  valueType?: AiWorkflowNodeInputFieldValueType;
  name: string;
  description?: string;
  defaultValue?: any;
  injectInputType?: AiWorkflowNodeOutputType[];
  options?: string[];
  value?: any;
  toolMode?: boolean;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface AiWorkflowNodeOutput {
  id: string;
  outputTypes: AiWorkflowNodeOutputType[];
  name: string;
  description?: string;
  toolMode?: boolean;
}

export type BaseWorkflowComponent = {
  id: string;
  category: AiWorkflowComponentCategory;
  type: AiWorkflowComponentType;
  name: string;
  description?: string;
};

export interface AiWorkflowComponent extends Node {
  data: BaseWorkflowComponent & {
    node?: {
      fieldOrder?: string[];
      inputFields?: Record<string, AiWorkflowNodeInputField>;
      outputs: Array<AiWorkflowNodeOutput>;
    };
  };
}

export interface AiWorkflowEdge extends Edge {
  data: {
    sourceHandle: {
      id: string;
      name: string;
      type: AiWorkflowComponentType;
      outputTypes: AiWorkflowNodeOutputType[];
    };
    targetHandle?: {
      id: string;
      name: string;
      type: AiWorkflowComponentType;
      inputTypes: AiWorkflowNodeOutputType[];
    };
  };
}

export interface AiWorkflow extends DbDocument {
  name: string;
  description: string;
  data: {
    nodes: AiWorkflowComponent[];
    edges: AiWorkflowEdge[];
    viewport: Viewport;
  };
}
