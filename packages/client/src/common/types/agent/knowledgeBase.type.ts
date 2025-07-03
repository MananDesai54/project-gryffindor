import { DbDocument } from "../dbDocument.type";
import { KnowledgeBaseType } from "./ai.type";

export interface KnowledgeBase extends DbDocument {
  type: KnowledgeBaseType;
  name: string;
  // text
  content: string;
  // file, link
  url: string;
  // file
  mimeType: string;
}
