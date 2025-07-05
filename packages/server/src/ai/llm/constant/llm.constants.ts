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
    modelId: 'claude-sonnet-4',
    type: LLMType.STANDARD,
    provider: StandardLLMProvider.ANTHROPIC,
  },
  {
    modelId: 'claude-3-7-sonnet',
    type: LLMType.STANDARD,
    provider: StandardLLMProvider.ANTHROPIC,
  },
  {
    modelId: 'claude-3-5-sonnet',
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
}
