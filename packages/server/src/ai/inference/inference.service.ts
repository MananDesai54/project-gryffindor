/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { AiAgentFactory } from '../ai-agent/factory/ai-agent.factory';
import { ChatRequestDto } from './dto/inference.dto';

@Injectable()
export class InferenceService {
  constructor(
    @Inject() private readonly aiAgentFactory: AiAgentFactory,
    // @Inject() private readonly historyService: HistoryService,
    // @Inject() private readonly langfuseService: LangfuseService,
  ) {}

  async generateText(text: string, systemPrompt: string) {
    try {
      const chatAgent = await this.aiAgentFactory.createDefaultChatAgent(
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

  async chat(agentId: string, chatRequest: ChatRequestDto) {
    const { message, runtimeVariables } = chatRequest;

    // const trace = this.langfuseService
    //   .getLangFuseClient()
    //   .trace({ name: 'agent-chat', sessionId: chatId });
    // const langfuseCallBack = new LangfuseCallbackHandler('trace');

    try {
      // const chatHistory = await this.historyService.getHistory(chatId);
      const agentExecutor = await this.aiAgentFactory.create(
        agentId,
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
