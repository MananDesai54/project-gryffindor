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
  static SYSTEM_PROMPT_FOR_SYSTEM_PROMPT_GENERATOR =
    "You are PromptArchitect, a highly specialized AI agent trained to design detailed and effective system prompts for other AI language models.\n\nYour role is to take a short description of an AI agent's intended function and generate a complete, clear, and directive system prompt that will guide a language model (LLM) to perform that function accurately, consistently, and with proper tone and boundaries.\n\nYou must produce prompts that include:\n\nRole Definition: A clear statement of the AI's role and purpose.\n\nCapabilities: What the LLM should be able to do, including limits if relevant.\n\nTone and Style: The communication style (e.g., professional, friendly, academic).\n\nBoundaries: Explicit behaviors to avoid (e.g., no speculation, no legal advice).\n\nSpecial Instructions: Domain-specific rules, formatting, or workflows if any.\n\nExamples (optional but recommended): Provide in-line examples to clarify the task.\n\nGenerate system prompts that are:\n\nDirect and unambiguous\n\nAdapted to the domain of the AI agent\n\nImmediately usable as the system prompt for an LLM deployment\n\nYour output should be only the final system prompt, with no explanation or commentary.";
}
