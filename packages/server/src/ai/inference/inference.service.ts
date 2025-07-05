/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { AgentFactoryService } from './agent-factory/agent-factory.service';
import { ChatRequestDto } from './dto/inference.dto';
import { AiAgent } from 'src/ai/ai-agent/schema/ai-agent.schema';
import { LLM } from 'src/ai/llm/schema/llm.schema';
import { AiTool } from 'src/ai/ai-tool/schema/ai-tool.schema';

@Injectable()
export class InferenceService {
  constructor(
    @Inject() private readonly agentFactoryService: AgentFactoryService,
    // @Inject() private readonly historyService: HistoryService,
    // @Inject() private readonly langfuseService: LangfuseService,
  ) {}

  async generateText(text: string, systemPrompt: string) {
    try {
      const chatAgent = await this.agentFactoryService.createDefaultChatAgent(
        systemPrompt,
        text,
      );
      const result = await chatAgent.invoke({});
      return {
        response: result.output,
      };
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error generating text');
    }
  }

  async chat(
    agentId: string,
    chatRequest: ChatRequestDto,
    agent: AiAgent,
    llm: LLM,
    tools: AiTool[],
  ) {
    const { message, runtimeVariables } = chatRequest;

    // const trace = this.langfuseService
    //   .getLangFuseClient()
    //   .trace({ name: 'agent-chat', sessionId: chatId });
    // const langfuseCallBack = new LangfuseCallbackHandler('trace');

    try {
      // const chatHistory = await this.historyService.getHistory(chatId);
      const agentExecutor = await this.agentFactoryService.create(
        agent,
        llm,
        tools,
        runtimeVariables,
      );
      const result = await agentExecutor.invoke(
        { input: message },
        // { message, chat_history: chatHistory },
        // { callbacks: [langfuseCallBack] },
      );
      const output = result.output;
      // await this.historyService.addTurn(chatId, message, output);
      // trace.update({ output });

      return {
        response: output,
      };
    } catch (error) {
      // trace.update({ level: 'ERROR', statusMessage: error.message });
      throw new InternalServerErrorException(error);
    } finally {
      // await this.langfuseService.shutdown();
    }
  }
}
