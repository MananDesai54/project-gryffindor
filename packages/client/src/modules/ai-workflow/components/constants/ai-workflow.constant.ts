import {
  AiWorkflowComponentCategory,
  AiWorkflowComponentType,
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
  [AiWorkflowComponentCategory.IO]: Cable,
  [AiWorkflowComponentCategory.Agent]: BrainCircuit,
  [AiWorkflowComponentCategory.LLM]: BrainCog,
  [AiWorkflowComponentCategory.Data]: Database,
} as Record<
  AiWorkflowComponentCategory,
  ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >
>;

export const WorkflowComponentVsIcon = {
  [AiWorkflowComponentType.ChatInput]: MessagesSquare,
  [AiWorkflowComponentType.ChatOutput]: MessagesSquare,
  [AiWorkflowComponentType.TextInput]: Type,
  [AiWorkflowComponentType.TextOutput]: Type,
} as Record<
  AiWorkflowComponentType,
  ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >
>;
