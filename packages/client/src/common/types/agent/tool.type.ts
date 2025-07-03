import { DbDocument } from "../dbDocument.type";
import { AiToolType } from "./ai.type";

export interface ApiParamsValueSchema {
  name: string;
  datatype: string;
  description: string;
  valueType: string;
  value: string;
}

export interface WebhookBodySchema {
  description?: string;
  payloadParams: ApiParamsValueSchema[];
}

export interface WebhookApiSchema {
  url: string;
  method: string;
  headers?: ApiParamsValueSchema[];
  pathParam?: ApiParamsValueSchema[];
  queryParams?: ApiParamsValueSchema[];
  body?: WebhookBodySchema;
}

export interface AiTool extends DbDocument {
  type: AiToolType;
  name: string;
  description: string;
  // webhook
  dynamicVariables?: Record<string, string>;
  reqTimeout?: number;
  apiSchema?: WebhookApiSchema;
  // agent
  agentId?: string;
}
