import { StandardLLM } from '../schema/llm.schema';
import { LLMType, StandardLLMProvider } from '../types/llm.type';

const StandardLLMs: Partial<StandardLLM>[] = [
  // {
  //   modelId: 'gemini-2.5-flash',
  //   type: LLMType.STANDARD,
  //   provider: StandardLLMProvider.GOOGLE,
  // },
  // {
  //   modelId: 'gemini-2.0-flash',
  //   type: LLMType.STANDARD,
  //   provider: StandardLLMProvider.GOOGLE,
  // },
  {
    modelId: 'claude-sonnet-4-0',
    type: LLMType.STANDARD,
    provider: StandardLLMProvider.ANTHROPIC,
  },
  {
    modelId: 'claude-3-7-sonnet-latest',
    type: LLMType.STANDARD,
    provider: StandardLLMProvider.ANTHROPIC,
  },
  {
    modelId: 'claude-3-5-sonnet-latest',
    type: LLMType.STANDARD,
    provider: StandardLLMProvider.ANTHROPIC,
  },
  {
    modelId: 'gpt-4.1',
    type: LLMType.STANDARD,
    provider: StandardLLMProvider.OPENAI,
  },
  {
    modelId: 'gpt-4.1-mini',
    type: LLMType.STANDARD,
    provider: StandardLLMProvider.OPENAI,
  },
  {
    modelId: 'gpt-4.1-nano',
    type: LLMType.STANDARD,
    provider: StandardLLMProvider.OPENAI,
  },
  {
    modelId: 'gpt-4o',
    type: LLMType.STANDARD,
    provider: StandardLLMProvider.OPENAI,
  },
  {
    modelId: 'gpt-4o-mini',
    type: LLMType.STANDARD,
    provider: StandardLLMProvider.OPENAI,
  },
  {
    modelId: 'o3-mini',
    type: LLMType.STANDARD,
    provider: StandardLLMProvider.OPENAI,
  },
];

export class LLMConstants {
  static STANDARD_MODELS = StandardLLMs;

  static DEFAULT_MODEL_ID = 'gpt-4.1';

  static DEFAULT_MODEL = {
    modelId: LLMConstants.DEFAULT_MODEL_ID,
    type: LLMType.STANDARD,
    provider: StandardLLMProvider.OPENAI,
  } as StandardLLM;

  static SYSTEM_PROMPT_FOR_SYSTEM_PROMPT_GENERATOR = `You are a Prompt Architect. You have to generate a system prompt for other ai agents based on given user input. Give more information about what user wants to achieve with the system prompt. Provide details on the desired outcome, context. Do not add any constraints or limitations to the system prompt. Ensure that the system prompt is clear, concise, and easy to understand. Use simple language and avoid technical jargon. Make sure that the system prompt is specific and focused on the user's needs. Provide examples of how the system prompt can be used in different scenarios. Ensure that the system prompt is flexible and adaptable to different situations. Finally, make sure that the system prompt is well-written and polished, with no spelling or grammar errors. Just give the system prompt as output no other spam.\n For Example:
  User query: You are a research agent, you are going to help security agents in the organization to perform various tasks, like searching for criminal records and doing background verification. You can seach across various parameters, starting with Name and DOB(Optional) to do your research.
  Agent Output:
  # Personality

  You are a research agent designed to assist security personnel. You are thorough, discreet, and efficient in gathering and presenting information. You prioritize accuracy and compliance with all relevant regulations.

  # Environment

  You are operating within a secure system accessible only to authorized security agents. The agents will provide you with specific search parameters, and you will access various databases to retrieve relevant information. The environment requires you to maintain confidentiality and adhere to strict data protection protocols.

  # Tone

  Your responses are professional, objective, and concise. You present information clearly and without personal opinions or biases. You use precise language and avoid ambiguity. You acknowledge requests promptly and provide updates on your progress as needed.

  # Goal

  Your primary goal is to assist security agents by efficiently and accurately gathering information for background checks and criminal record searches.

  1.  **Data Input**: Receive and confirm search parameters from the security agent (Name, DOB (Optional), etc.).
  2.  **Database Search**: Access and query relevant databases to gather information.
  3.  **Information Filtering**: Filter and organize the gathered data to remove irrelevant or redundant information.
  4.  **Report Generation**: Compile the relevant information into a clear, concise report.
  5.  **Delivery**: Provide the report to the security agent in a secure manner.

  # Guardrails

  You must not provide information to unauthorized users. You must not access or attempt to access data beyond your authorized access levels. You must not store or retain any personal data beyond the immediate task requirements. You must adhere to all data protection regulations and organizational policies. You must not provide any subjective analysis or personal opinions.

  You can use other tools provided by user to get more information about research

  `;

  static STANDARD_MODEL_PER_MILLION_COST_USD = {
    'gemini-2.5-flash': {
      input: 0.3,
      output: 2.5,
    },
    'gemini-2.0-flash': {
      input: 0.1,
      output: 0.4,
    },
    'claude-sonnet-4-0': {
      input: 3,
      output: 15,
    },
    'claude-3-7-sonnet-latest': {
      input: 3,
      output: 15,
    },
    'claude-3-5-sonnet-latest': {
      input: 3,
      output: 15,
    },
    'gpt-4.1': {
      input: 2,
      output: 8,
    },
    'gpt-4.1-mini': {
      input: 0.4,
      output: 1.6,
    },
    'gpt-4.1-nano': {
      input: 0.1,
      output: 0.4,
    },
    'gpt-4o': {
      input: 2.5,
      output: 10,
    },
    'gpt-4o-mini': {
      input: 0.15,
      output: 0.6,
    },
    'o3-mini': {
      input: 1.1,
      output: 4.4,
    },
  } as Record<string, { input: number; output: number }>;
}
