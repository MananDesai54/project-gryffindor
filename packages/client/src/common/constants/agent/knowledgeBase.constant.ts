import { KnowledgeBaseType } from "../../types/agent/ai.type";

export const KnowledgeBaseTypeLabel = {
  [KnowledgeBaseType.FILE]: "File",
  [KnowledgeBaseType.LINK]: "Link",
  [KnowledgeBaseType.TEXT]: "Text",
} as Record<KnowledgeBaseType, string>;
