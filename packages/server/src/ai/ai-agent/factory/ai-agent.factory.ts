import { StringOutputParser } from '@langchain/core/output_parsers';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { Inject, Injectable } from '@nestjs/common';
import { AgentExecutor } from 'langchain/agents';
import { forEach } from 'lodash';
import { AiToolService } from '../../ai-tool/ai-tool.service';
import { AiToolFactory } from '../../ai-tool/factory/ai-tool.factory';
import { WebhookAiTool } from '../../ai-tool/schema/ai-tool.schema';
import { AiToolType } from '../../ai-tool/types/ai-tool.type';
import { LLMConstants } from '../../llm/constant/llm.constants';
import { LLMFactory } from '../../llm/factory/llm.factory';
import { LlmService } from '../../llm/llm.service';
import { AiAgentService } from '../ai-agent.service';
import { AiAgentKnowledgeBaseFactory } from './ai-agent-knowledge-base.fcatory';

@Injectable()
export class AiAgentFactory {
  constructor(
    @Inject() private readonly aiAgentService: AiAgentService,
    @Inject() private readonly aiToolService: AiToolService,
    @Inject() private readonly llmService: LlmService,
    @Inject() private readonly llmFactory: LLMFactory,
    @Inject()
    private readonly aiAgentKnowledgeBaseFactory: AiAgentKnowledgeBaseFactory,
    @Inject() private readonly aiToolFactory: AiToolFactory,
  ) {}

  async create(
    agentId: string,
    runTimeVariables?: Record<string, string>,
    runTimeApiVariables?: Record<string, string>,
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

    if (
      aiAgent.configuration?.knowledgeBase &&
      aiAgent.configuration?.knowledgeBase?.length > 0
    ) {
      const retrieverTool =
        this.aiAgentKnowledgeBaseFactory.createAgentKnowledgeBaseTool(
          aiAgent._id,
          this._sanitizeToolName(aiAgent.name),
          aiAgent.description,
        );
      // @ts-ignore
      tools.push(retrieverTool);
    }
    forEach(toolsDetails, (tool) => {
      if ((tool.type as AiToolType) === AiToolType.WEB_HOOK) {
        tools.push(
          this.aiToolFactory.createWebhookTool(
            {
              ...tool.toObject(),
              name: this._sanitizeToolName(tool.name),
            } as unknown as WebhookAiTool,
            runTimeApiVariables,
          ),
        );
      }
    });

    let systemPrompt =
      aiAgent.configuration?.systemPrompt || 'You are a helpful assistant.';
    for (const key in runTimeVariables) {
      const placeholder = `{{${key}}}`;
      systemPrompt = systemPrompt
        .concat(
          ' Other then this information you can also use tools which will help to get better information about user query.\n IMPORTANT: After you have used a tool to retrieve information, your next step is to synthesize that information and provide a final answer to the user. DO NOT use the same tool again for the same query. Once you have the context from a tool, formulate your response.',
        )
        .replace(new RegExp(placeholder, 'g'), runTimeVariables?.[key] || '');
    }

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', systemPrompt],
      new MessagesPlaceholder('chat_history'),
      ['human', '{input}'],
      new MessagesPlaceholder('agent_scratchpad'),
    ]);

    return this.llmFactory.createAgentExecutorForLLM(
      llmDetails,
      llm,
      prompt,
      tools,
    );
  }

  createDefaultChatAgent(systemPrompt: string, input: string) {
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', systemPrompt],
      ['human', input],
    ]);
    const outputParser = new StringOutputParser();

    const llm = this.llmFactory.create(LLMConstants.DEFAULT_MODEL);

    const chain = prompt.pipe(llm).pipe(outputParser);

    return chain;
  }

  // =============== private methods
  private _sanitizeToolName(name: string): string {
    // Replace spaces and consecutive unsupported characters with a single underscore
    const withUnderscores = name.replace(/\s+/g, '_');

    // Remove any character that is not a letter, number, underscore, or dash
    const sanitized = withUnderscores.replace(/[^a-zA-Z0-9_-]/g, '');

    // Truncate to the maximum length (63 to be safe, as spec is 64)
    return sanitized.slice(0, 63);
  }
}
