import { AiToolType } from "../../types/agent/ai.type";

export const ToolTypeLabel = {
  [AiToolType.WEB_HOOK]: "Webhook",
  [AiToolType.AGENT]: "Agent",
} as Record<AiToolType, string>;
