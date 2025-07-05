import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { Inject, Injectable } from '@nestjs/common';
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';
import { forEach } from 'lodash';
import { AiToolService } from '../../ai-tool/ai-tool.service';
import { WebhookAiTool } from '../../ai-tool/schema/ai-tool.schema';
import { AiToolType } from '../../ai-tool/types/ai-tool.type';
import { LLMConstants } from '../../llm/constant/llm.constants';
import { LlmService } from '../../llm/llm.service';
import { ChromaDBResourceType } from '../../../infra/chromadb/type/chromadb.type';
import { ChromadbService } from '../../../infra/chromadb/chromadb.service';
import { AiToolFactory } from '../../ai-tool/factory/ai-tool.factory';
import { LLMFactory } from '../../llm/factory/llm.factory';
import { AiAgentService } from '../ai-agent.service';

@Injectable()
export class AiAgentFactory {
  constructor(
    @Inject() private readonly aiAgentService: AiAgentService,
    @Inject() private readonly aiToolService: AiToolService,
    @Inject() private readonly llmService: LlmService,
    @Inject() private readonly llmFactory: LLMFactory,
    @Inject() private readonly chromadbService: ChromadbService,
    @Inject() private readonly aiToolFactory: AiToolFactory,
  ) {}

  async create(
    agentId: string,
    runTimeVariables?: Record<string, string>,
  ): Promise<AgentExecutor> {
    const aiAgent = await this.aiAgentService.read(agentId);
    const llmDetails = aiAgent.configuration?.llm
      ? await this.llmService.read(aiAgent.configuration?.llm)
      : LLMConstants.DEFAULT_MODEL;
    const toolsDetails = aiAgent.configuration?.customTools?.length
      ? await this.aiToolService.findMany(aiAgent.configuration?.customTools)
      : [];

    const llm = this.llmFactory.create(
      llmDetails,
      aiAgent.configuration?.temperature,
      aiAgent.configuration?.maxTokens,
    );

    const tools: DynamicStructuredTool[] = [];
    if (aiAgent.configuration?.knowledgeBase?.length > 0) {
      const retrieverTool = this.chromadbService.getRetrieverTool(
        aiAgent._id,
        ChromaDBResourceType.Agent,
        aiAgent.name,
        aiAgent.description,
      );
      // @ts-ignore
      tools.push(retrieverTool);
    }
    forEach(toolsDetails, (tool) => {
      if ((tool.type as AiToolType) === AiToolType.WEB_HOOK) {
        tools.push(
          this.aiToolFactory.createWebhookTool(
            tool as unknown as WebhookAiTool,
          ),
        );
      }
    });

    let systemPrompt =
      aiAgent.configuration?.systemPrompt || 'You are a helpful assistant.';
    for (const key in runTimeVariables) {
      const placeholder = `{{${key}}}`;
      systemPrompt = systemPrompt.replace(
        new RegExp(placeholder, 'g'),
        runTimeVariables?.[key] || '',
      );
    }

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', systemPrompt],
      // new MessagesPlaceholder('chat_history'),
      ['human', '{input}'],
      new MessagesPlaceholder('agent_scratchpad'),
    ]);

    const agent = await createOpenAIFunctionsAgent({ llm, tools, prompt });

    return new AgentExecutor({
      agent,
      tools,
      verbose: true,
    });
  }

  async createDefaultChatAgent(systemPrompt: string, input: string) {
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', systemPrompt],
      ['human', input],
      new MessagesPlaceholder('agent_scratchpad'),
    ]);

    const llm = this.llmFactory.create(LLMConstants.DEFAULT_MODEL);

    const agent = await createOpenAIFunctionsAgent({ llm, tools: [], prompt });

    const executor = new AgentExecutor({
      agent,
      tools: [],
      verbose: true,
    });

    return executor;
  }
}
