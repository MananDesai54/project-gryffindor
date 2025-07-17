import {
  AiWorkflowNode,
  AiWorkflowNodeCategory,
  AiWorkflowNodeType,
  AiWorkflowNodeConnectionType,
  AiWorkflowNodeInputFieldValueType,
  BaseWorkflowNode,
} from "@gryffindor/client/common/types/ai-workflow/ai-workflow.type";

export const WorkflowNodesByCategory: Record<
  AiWorkflowNodeCategory,
  BaseWorkflowNode[]
> = {
  [AiWorkflowNodeCategory.IO]: [
    {
      category: AiWorkflowNodeCategory.IO,
      name: "Chat Input",
      type: AiWorkflowNodeType.ChatInput,
      id: "chat-input",
      description: "Get chat input from the user",
    },
    {
      category: AiWorkflowNodeCategory.IO,
      name: "Chat Output",
      type: AiWorkflowNodeType.ChatOutput,
      id: "chat-output",
      description: "Display chat output to the user",
    },
    {
      category: AiWorkflowNodeCategory.IO,
      name: "Text Input",
      type: AiWorkflowNodeType.TextInput,
      id: "text-input",
    },
    {
      category: AiWorkflowNodeCategory.IO,
      name: "Text Output",
      type: AiWorkflowNodeType.TextOutput,
      id: "text-output",
    },
  ],
  [AiWorkflowNodeCategory.Agent]: [],
  [AiWorkflowNodeCategory.LLM]: [],
  [AiWorkflowNodeCategory.Data]: [],
};

export const WorkflowNodes: Record<
  AiWorkflowNodeType,
  Partial<AiWorkflowNode>
> = {
  [AiWorkflowNodeType.ChatInput]: {
    data: {
      node: {
        outputs: [
          {
            id: `${AiWorkflowNodeType.ChatInput}-message-output`,
            name: "Message",
            outputTypes: [AiWorkflowNodeConnectionType.Message],
          },
        ],
      },
    },
  },
  [AiWorkflowNodeType.ChatOutput]: {
    data: {
      node: {
        inputFields: {
          input: {
            id: `${AiWorkflowNodeType.ChatOutput}-input-value`,
            name: "Input",
            type: AiWorkflowNodeConnectionType.Message,
            required: true,
            valueType: AiWorkflowNodeInputFieldValueType.connection,
            injectInputTypes: [AiWorkflowNodeConnectionType.Message],
          },
        },
        outputs: [
          {
            id: `${AiWorkflowNodeType.ChatOutput}-message-output`,
            name: "Message",
            outputTypes: [AiWorkflowNodeConnectionType.Message],
          },
        ],
      },
    },
  },
};
