import { DbDocument } from "../dbDocument.type";

interface AiAgentConfiguration {
  firstMessage?: string;
  systemPrompt?: string;
  dynamicVariables?: Record<string, string>;
  temperature?: number;
  maxTokens?: number;
  knowledgeBase?: string[];
  builtInTools?: string[];
  customTools?: string[];
  llm: string;
}

export interface Agent extends DbDocument {
  name: string;
  description?: string;
  configuration?: AiAgentConfiguration;
}
