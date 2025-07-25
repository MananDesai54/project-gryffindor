import { Edge, Node, Viewport } from "@xyflow/react";
import { DbDocument } from "../dbDocument.type";

export enum AiWorkflowNodeCategory {
  IO = "io",
  LLM = "llm",
  Agent = "agent",
  Data = "data",
}

export enum AiWorkflowNodeType {
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

export enum AiWorkflowNodeInputFieldValueType {
  string = "string",
  number = "number",
  boolean = "boolean",
  tool = "tool",
}

export enum AiWorkflowNodeConnectionType {
  Message = "message",
  Tools = "tools",
}

export interface AiWorkflowNodeInputField {
  id: string;
  type: AiWorkflowNodeInputFieldValueType;
  name: string;
  description?: string;
  defaultValue?: any;
  injectInputTypes?: AiWorkflowNodeConnectionType[];
  options?: string[];
  value?: any;
  allowMulti?: boolean;
  toolMode?: boolean;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface AiWorkflowNodeOutput {
  id: string;
  outputTypes: AiWorkflowNodeConnectionType[];
  name: string;
  description?: string;
  toolMode?: boolean;
}

export type BaseWorkflowNode = {
  id: string;
  category: AiWorkflowNodeCategory;
  type: AiWorkflowNodeType;
  name: string;
  description?: string;
};

export interface AiWorkflowNode extends Node {
  data: BaseWorkflowNode & {
    node?: {
      fieldOrder?: string[];
      inputFields?: Record<string, AiWorkflowNodeInputField>;
      outputs?: Array<AiWorkflowNodeOutput>;
    };
  };
}

export interface AiWorkflowEdge extends Edge {
  data: {
    sourceHandle: {
      id: string;
      name: string;
      type: AiWorkflowNodeType;
      outputTypes: AiWorkflowNodeConnectionType[];
    };
    targetHandle: {
      id: string;
      name: string;
      type: AiWorkflowNodeType;
      inputTypes: AiWorkflowNodeConnectionType[];
    };
  };
}

export interface AiWorkflow extends DbDocument {
  name: string;
  description: string;
  data: {
    nodes: AiWorkflowNode[];
    edges: AiWorkflowEdge[];
    viewport: Viewport;
  };
}
