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
  [AiWorkflowNodeCategory.Agent]: [
    {
      category: AiWorkflowNodeCategory.Agent,
      name: "Agent",
      type: AiWorkflowNodeType.Agent,
      id: "agent",
      description:
        "Define the agent's instructions, then enter a task to complete using tools",
    },
  ],
  [AiWorkflowNodeCategory.LLM]: [
    {
      category: AiWorkflowNodeCategory.LLM,
      name: "Language Model",
      type: AiWorkflowNodeType.LLM,
      id: "llm",
      description: "Runs a language model given a specified provider",
    },
  ],
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
    } as AiWorkflowNode["data"],
  },
  [AiWorkflowNodeType.ChatOutput]: {
    data: {
      node: {
        inputFields: {
          input: {
            id: `${AiWorkflowNodeType.ChatOutput}-input-value`,
            name: "Input",
            required: true,
            type: AiWorkflowNodeInputFieldValueType.string,
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
  [AiWorkflowNodeType.Agent]: {
    data: {
      node: {
        inputFields: {
          model_provider: {
            id: `${AiWorkflowNodeType.Agent}-model-provider`,
            name: "Provider",
            required: true,
            type: AiWorkflowNodeInputFieldValueType.string,
            options: ["Open Ai", "Antripics", "Google"],
            placeholder: "Select the model provider",
            defaultValue: "Open Ai",
          },
          model_name: {
            id: `${AiWorkflowNodeType.Agent}-model-name`,
            name: "Model Name",
            required: true,
            type: AiWorkflowNodeInputFieldValueType.string,
            placeholder: "Select the model name",
            options: ["gpt-3.5-turbo", "gpt-4", "text-davinci-003"],
            defaultValue: "gpt-3.5-turbo",
          },
          system_prompt: {
            id: `${AiWorkflowNodeType.Agent}-system-prompt`,
            name: "System Prompt",
            required: true,
            type: AiWorkflowNodeInputFieldValueType.string,
            placeholder: "Define Agent System prompt",
          },
          tools: {
            id: `${AiWorkflowNodeType.Agent}-tools`,
            name: "Tools",
            type: AiWorkflowNodeInputFieldValueType.tool,
            injectInputTypes: [AiWorkflowNodeConnectionType.Tools],
            placeholder: "Provide Agent tools",
            allowMulti: true,
          },
        },
        outputs: [
          {
            id: `${AiWorkflowNodeType.ChatOutput}-agent-output`,
            name: "Response",
            outputTypes: [AiWorkflowNodeConnectionType.Message],
          },
        ],
      },
    },
  },
};
