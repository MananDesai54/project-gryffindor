import { StandardLLM } from '../schema/llm.schema';
import { LLMType, StandardLLMProvider } from '../types/llm.type';

const StandardLLMs: Partial<StandardLLM>[] = [
  {
    modelId: 'gemini-2.5-flash',
    type: LLMType.STANDARD,
    provider: StandardLLMProvider.GOOGLE,
  },
  {
    modelId: 'gemini-2.0-flash',
    type: LLMType.STANDARD,
    provider: StandardLLMProvider.GOOGLE,
  },
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
  static DEFAULT_MODEL_ID = 'gemini-2.5-flash';
  static DEFAULT_MODEL = {
    modelId: LLMConstants.DEFAULT_MODEL_ID,
    type: LLMType.STANDARD,
    provider: StandardLLMProvider.GOOGLE,
  } as StandardLLM;
  static SYSTEM_PROMPT_FOR_SYSTEM_PROMPT_GENERATOR = `You are a Prompt Architect. You have to generate a system prompt for other ai agents based on given user input. Give more information about what user wants to achieve with the system prompt. Provide details on the desired outcome, context. Do not add any constraints or limitations to the system prompt. Ensure that the system prompt is clear, concise, and easy to understand. Use simple language and avoid technical jargon. Make sure that the system prompt is specific and focused on the user's needs. Provide examples of how the system prompt can be used in different scenarios. Ensure that the system prompt is flexible and adaptable to different situations. Finally, make sure that the system prompt is well-written and polished, with no spelling or grammar errors. At the end You have to generate a text based insights for the user query`;
}
