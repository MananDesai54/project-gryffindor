import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { Inject, Injectable } from '@nestjs/common';
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';
import { forEach } from 'lodash';
import { ChromadbService } from 'src/infra/chromadb/chromadb.service';
import { LlmFactoryService } from '../llm-factory/llm-factory.service';
import { ToolFactoryService } from '../tool-factory/tool-factory.service';
import { AiAgent } from 'src/ai/ai-agent/schema/ai-agent.schema';
import { LLM } from 'src/ai/llm/schema/llm.schema';
import { AiTool, WebhookAiTool } from 'src/ai/ai-tool/schema/ai-tool.schema';
import { AiToolType } from 'src/ai/ai-tool/types/ai-tool.type';

@Injectable()
export class AgentFactoryService {
  constructor(
    // @Inject() private readonly aiAgentService: AiAgentService,
    @Inject() private readonly llmFactoryService: LlmFactoryService,
    @Inject() private readonly chromadbService: ChromadbService,
    @Inject() private readonly toolFactoryService: ToolFactoryService,
    // @Inject() private readonly llmService: LlmService,
    // @Inject() private readonly aiToolService: AiToolService,
  ) {
    console.log('AgentFactoryService');
  }

  async create(
    agentId: string,
    aiAgent: AiAgent,
    llmDetails: LLM,
    toolsDetails: AiTool[],
    runTimeVariables?: Record<string, string>,
  ): Promise<AgentExecutor> {
    const llm = this.llmFactoryService.create(llmDetails, aiAgent);

    const tools: DynamicStructuredTool[] = [];
    if (aiAgent.configuration?.knowledgeBase?.length > 0) {
      const retrieverTool = this.chromadbService.getRetrieverForAgent(
        aiAgent._id,
        aiAgent.name,
        aiAgent.description,
      );
      // @ts-ignore
      tools.push(retrieverTool);
    }
    forEach(toolsDetails, (tool) => {
      if ((tool.type as AiToolType) === AiToolType.WEB_HOOK) {
        tools.push(
          this.toolFactoryService.createWebhookTool(
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
}
