/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ChatAnthropic } from '@langchain/anthropic';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { CustomLLM, LLM, StandardLLM } from '../../llm/schema/llm.schema';
import { LLMType, StandardLLMProvider } from '../../llm/types/llm.type';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StructuredTool } from '@langchain/core/tools';
import {
  RunnablePassthrough,
  RunnableSequence,
} from '@langchain/core/runnables';
import { formatToOpenAIToolMessages } from 'langchain/agents/format_scratchpad/openai_tools';
import { OpenAIToolsAgentOutputParser } from 'langchain/agents/openai/output_parser';
import { XMLAgentOutputParser } from 'langchain/agents/xml/output_parser';
import { AgentExecutor } from 'langchain/agents';

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

  createAgentExecutorForLLM(
    llm: LLM,
    llmModel: BaseChatModel,
    prompt: ChatPromptTemplate,
    tools: StructuredTool[],
  ) {
    switch (llm.type as LLMType) {
      case LLMType.STANDARD:
        switch ((llm as StandardLLM).provider as StandardLLMProvider) {
          case StandardLLMProvider.OPENAI:
            return this._createOpenAIAgentExecutor(llmModel, prompt, tools);
          case StandardLLMProvider.GOOGLE:
            return this._createGoogleAgentExecutor(llmModel, prompt, tools);
          case StandardLLMProvider.ANTHROPIC:
            return this._createAnthropicAgentExecutor(llmModel, prompt, tools);
          default:
            throw new Error(`Unsupported Standard LLM type: ${llm.type}`);
        }
      case LLMType.CUSTOM:
        return this._createOpenAIAgentExecutor(llmModel, prompt, tools);
      default:
        throw new Error(`Unsupported LLM type: ${llm.type}`);
    }
  }

  // ================ Private Methods ================
  private _createOpenAIAgentExecutor(
    llm: BaseChatModel,
    prompt: ChatPromptTemplate,
    tools: StructuredTool[],
  ) {
    const llmWithTools = llm.bindTools?.(tools);
    const agent = RunnableSequence.from([
      RunnablePassthrough.assign({
        agent_scratchpad: (input) => {
          return formatToOpenAIToolMessages(input.steps as any[]);
        },
      }),
      prompt,
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      llmWithTools!,
      new OpenAIToolsAgentOutputParser(),
    ]);

    return new AgentExecutor({
      agent,
      tools,
      verbose: false,
    });
  }

  private _createAnthropicAgentExecutor(
    llm: BaseChatModel,
    prompt: ChatPromptTemplate,
    tools: StructuredTool[],
  ) {
    const llmWithTools = llm.bindTools?.(tools);
    const agent = RunnableSequence.from([
      RunnablePassthrough.assign({
        agent_scratchpad: (input) => {
          return formatToOpenAIToolMessages(input.steps as any[]);
        },
      }),
      prompt,
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      llmWithTools!,
      new XMLAgentOutputParser(),
    ]);

    return new AgentExecutor({
      agent,
      tools,
      verbose: false,
    });
  }

  private _createGoogleAgentExecutor(
    llm: BaseChatModel,
    prompt: ChatPromptTemplate,
    tools: StructuredTool[],
  ) {
    const llmWithTools = llm.bindTools?.(tools);
    const agent = RunnableSequence.from([
      RunnablePassthrough.assign({
        agent_scratchpad: (input) => {
          return formatToOpenAIToolMessages(input.steps as any[]);
        },
      }),
      prompt,
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      llmWithTools!,
      new OpenAIToolsAgentOutputParser(),
    ]);

    return new AgentExecutor({
      agent,
      tools,
      verbose: false,
    });
  }
}
