import { ChatAnthropic } from '@langchain/anthropic';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { CustomLLM, LLM, StandardLLM } from '../../llm/schema/llm.schema';
import { LLMType, StandardLLMProvider } from '../../llm/types/llm.type';

@Injectable()
export class LLMFactory {
  create(llm: LLM, temperature?: number, maxTokens?: number): BaseChatModel {
    const mt = maxTokens && maxTokens > 0 ? maxTokens : undefined;
    if ((llm.type as LLMType) === LLMType.STANDARD) {
      switch ((llm as StandardLLM).provider as StandardLLMProvider) {
        case StandardLLMProvider.OPENAI:
          return new ChatOpenAI({
            openAIApiKey: process.env.OPENAI_API_KEY,
            model: llm.modelId || 'gpt-4.1',
            temperature: temperature,
            maxTokens: mt,
            // streamUsage: true,
            // streaming: true,
          });
        case StandardLLMProvider.GOOGLE:
          return new ChatGoogleGenerativeAI({
            apiKey: process.env.GEMINI_API_KEY,
            model: llm.modelId || 'gemini-2.5-flash',
            temperature: temperature,
            maxOutputTokens: mt,
            // streamUsage: true,
            // streaming: true,
          });
        case StandardLLMProvider.ANTHROPIC:
          return new ChatAnthropic({
            anthropicApiKey: process.env.ANTHROPIC_API_KEY,
            model: llm.modelId || 'claude-3-7-sonnet-latest',
            temperature: temperature,
            maxTokens: mt,
            // streamUsage: true,
            // streaming: true,
          });
      }
    } else {
      return new ChatOpenAI({
        model: llm.modelId,
        temperature: temperature,
        maxTokens: mt,
        configuration: {
          apiKey: (llm as CustomLLM).apiKey,
          baseURL: (llm as CustomLLM).serverUrl,
        },
      });
    }
  }
}
