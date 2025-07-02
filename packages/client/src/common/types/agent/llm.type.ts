import { DbDocument } from "../dbDocument.type";
import { LLMType, StandardLLMProvider } from "./ai.type";

export interface LLM extends DbDocument {
  type: LLMType;
  modelId: string;
  // standard llm
  provider?: StandardLLMProvider;
  // custom llm
  serverUrl?: string;
  apiKey?: string;
}
