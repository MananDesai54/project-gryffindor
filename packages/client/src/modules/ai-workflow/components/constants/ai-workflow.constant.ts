import {
  AiWorkflowNodeCategory,
  AiWorkflowNodeType,
} from "@gryffindor/client/common/types/ai-workflow/ai-workflow.type";
import {
  BrainCircuit,
  BrainCog,
  Cable,
  Database,
  LucideProps,
  MessagesSquare,
  Type,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export const WorkflowCategoryVsIcon = {
  [AiWorkflowNodeCategory.IO]: Cable,
  [AiWorkflowNodeCategory.Agent]: BrainCircuit,
  [AiWorkflowNodeCategory.LLM]: BrainCog,
  [AiWorkflowNodeCategory.Data]: Database,
} as Record<
  AiWorkflowNodeCategory,
  ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >
>;

export const WorkflowNodeVsIcon = {
  [AiWorkflowNodeType.ChatInput]: MessagesSquare,
  [AiWorkflowNodeType.ChatOutput]: MessagesSquare,
  [AiWorkflowNodeType.TextInput]: Type,
  [AiWorkflowNodeType.TextOutput]: Type,
} as Record<
  AiWorkflowNodeType,
  ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >
>;
