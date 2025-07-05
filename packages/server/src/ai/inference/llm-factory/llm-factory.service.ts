import { ChatAnthropic } from '@langchain/anthropic';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatOpenAI } from '@langchain/openai';
import { Injectable, Logger } from '@nestjs/common';
import { CustomLLM, LLM, StandardLLM } from 'src/ai/llm/schema/llm.schema';
import { LLMType, StandardLLMProvider } from 'src/ai/llm/types/llm.type';

@Injectable()
export class LlmFactoryService {
  create(llm: LLM, temperature?: number, maxTokens?: number): BaseChatModel {
    if ((llm.type as LLMType) === LLMType.STANDARD) {
      switch ((llm as StandardLLM).provider as StandardLLMProvider) {
        case StandardLLMProvider.OPENAI:
          return new ChatOpenAI({
            openAIApiKey: process.env.OPENAI_API_KEY,
            model: llm.modelId || 'gpt-4.1',
            temperature: temperature,
            maxTokens: maxTokens,
          });
        case StandardLLMProvider.GOOGLE:
          Logger.log(process.env.GEMINI_API_KEY);
          return new ChatGoogleGenerativeAI({
            apiKey: process.env.GEMINI_API_KEY,
            model: llm.modelId || 'gemini-2.5-flash',
            temperature: temperature,
            maxOutputTokens: maxTokens,
          });
        case StandardLLMProvider.ANTHROPIC:
          return new ChatAnthropic({
            anthropicApiKey: process.env.ANTHROPIC_API_KEY,
            model: llm.modelId || 'claude-3-7-sonnet-latest',
            temperature: temperature,
            maxTokens: maxTokens,
          });
      }
    } else {
      return new ChatOpenAI({
        model: llm.modelId,
        temperature: temperature,
        maxTokens: maxTokens,
        configuration: {
          apiKey: (llm as CustomLLM).apiKey,
          baseURL: (llm as CustomLLM).serverUrl,
        },
      });
    }
  }
}
