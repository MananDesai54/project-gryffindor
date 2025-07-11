import { DbDocument } from "../dbDocument.type";
import { KnowledgeBaseType } from "./ai.type";

export interface KnowledgeBase extends DbDocument {
  type: KnowledgeBaseType;
  name: string;
  content: string;
  url: string;
  mimeType: string;
  dependentAgents: string[];
}
