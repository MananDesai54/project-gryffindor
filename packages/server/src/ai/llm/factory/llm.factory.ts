import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import {
  RunnablePassthrough,
  RunnableSequence,
} from '@langchain/core/runnables';
import { StructuredTool } from '@langchain/core/tools';
import { ChatOpenAI } from '@langchain/openai';
import { Injectable, Logger } from '@nestjs/common';
import { AgentExecutor } from 'langchain/agents';
import { formatToOpenAIToolMessages } from 'langchain/agents/format_scratchpad/openai_tools';
import { OpenAIToolsAgentOutputParser } from 'langchain/agents/openai/output_parser';
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
            // streaming: true,
          });
        case StandardLLMProvider.GOOGLE:
          return new ChatOpenAI({
            model: llm.modelId || 'gemini-2.5-flash',
            temperature: temperature,
            maxTokens: mt,
            apiKey: process.env.GEMINI_API_KEY,
            configuration: {
              apiKey: process.env.GEMINI_API_KEY,
              baseURL:
                'https://generativelanguage.googleapis.com/v1beta/openai/',
            },
            streaming: true,
          });
        case StandardLLMProvider.ANTHROPIC:
          return new ChatOpenAI({
            model: llm.modelId || 'claude-3-7-sonnet-latest',
            temperature: temperature,
            maxTokens: mt,
            configuration: {
              apiKey: process.env.ANTHROPIC_API_KEY,
              baseURL: 'https://api.anthropic.com/v1/',
            },
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
          case StandardLLMProvider.ANTHROPIC:
          case StandardLLMProvider.GOOGLE:
            return this._createOpenAIAgentExecutor(llmModel, prompt, tools);
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
          Logger.debug('[scratch pad input]', input);
          if (!input?.steps || (input?.steps as any[])?.length === 0) {
            return [];
          }
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

  // private _createAnthropicAgentExecutor(
  //   llm: BaseChatModel,
  //   prompt: ChatPromptTemplate,
  //   tools: StructuredTool[],
  // ) {
  //   const llmWithTools = llm.bindTools?.(tools);
  //   const agent = RunnableSequence.from([
  //     RunnablePassthrough.assign({
  //       agent_scratchpad: (input) => {
  //         return formatToOpenAIToolMessages(input.steps as any[]);
  //       },
  //     }),
  //     prompt,
  //     // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  //     llmWithTools!,
  //     new XMLAgentOutputParser(),
  //   ]);

  //   return new AgentExecutor({
  //     agent,
  //     tools,
  //     verbose: false,
  //   });
  // }

  // private _createGoogleAgentExecutor(
  //   llm: BaseChatModel,
  //   prompt: ChatPromptTemplate,
  //   tools: StructuredTool[],
  // ) {
  //   const llmWithTools = llm.bindTools?.(tools);
  //   const agent = RunnableSequence.from([
  //     RunnablePassthrough.assign({
  //       agent_scratchpad: (input) => {
  //         return formatToOpenAIToolMessages(input.steps as any[]);
  //       },
  //     }),
  //     prompt,
  //     llmWithTools!,
  //     new OpenAIToolsAgentOutputParser(),
  //   ]);

  //   return new AgentExecutor({
  //     agent,
  //     tools,
  //     verbose: false,
  //   });
  // }
}
