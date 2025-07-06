/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { LangfuseCallbackHandler } from '../../infra/observability/langfuse/langfuse.callback';
import { AuthContextType } from '../../auth/dto/auth.dto';
import { LangfuseService } from '../../infra/observability/langfuse/langfuse.service';
import { AiAgentFactory } from '../ai-agent/factory/ai-agent.factory';
import { ChatRequestDto } from './dto/inference.dto';
import { HistoryService } from './history/history.service';

@Injectable()
export class InferenceService {
  constructor(
    @Inject() private readonly aiAgentFactory: AiAgentFactory,
    @Inject() private readonly historyService: HistoryService,
    @Inject() private readonly langfuseService: LangfuseService,
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

  async chat(
    agentId: string,
    chatRequest: ChatRequestDto,
    authContext: AuthContextType,
  ) {
    const { message, runtimeVariables, chatId } = chatRequest;

    const trace = this.langfuseService.getLangFuseClient().trace({
      name: `chat_${agentId}_${chatId}_${authContext.userId}_${Date.now()}`,
      input: message,
      userId: authContext.userId,
      sessionId: chatId,
      timestamp: new Date(),
      tags: ['agent_chat'],
      metadata: {
        agentId,
      },
    });

    const langfuseCallBack = new LangfuseCallbackHandler(
      trace,
      this.langfuseService.getLangFuseClient(),
      authContext,
    );

    try {
      const chatHistory = await this.historyService.getHistoryForAgent(chatId);
      const agentExecutor = await this.aiAgentFactory.create(
        agentId,
        runtimeVariables,
      );
      const result = await agentExecutor.invoke(
        { input: message, chat_history: chatHistory },
        { callbacks: [langfuseCallBack] },
      );
      await this.historyService.addTurn(chatId, message, result.output);
      trace
        .span({
          level: 'ERROR',
          output: result.output,
          input: message,
          endTime: new Date(),
        })
        .end();

      return result;
    } catch (error) {
      trace.span({
        level: 'ERROR',
        input: message,
        endTime: new Date(),
        statusMessage: (error as Error).message,
        metadata: {
          fullError: error,
        },
      });
      throw new InternalServerErrorException(error);
    } finally {
      await this.langfuseService.shutdown();
    }
  }
}
