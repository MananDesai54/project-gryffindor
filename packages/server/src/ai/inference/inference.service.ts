/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { LangfuseCallbackHandler } from '../../infra/observability/langfuse/langfuse.callback';
import { AuthContextType } from '../../auth/dto/auth.dto';
import { LangfuseService } from '../../infra/observability/langfuse/langfuse.service';
import { AiAgentFactory } from '../ai-agent/factory/ai-agent.factory';
import { ChatRequestDto } from './dto/inference.dto';
import { HistoryService } from './history/history.service';

@Injectable()
export class InferenceService {
  private readonly logger = new Logger(InferenceService.name);

  constructor(
    @Inject() private readonly aiAgentFactory: AiAgentFactory,
    @Inject() private readonly historyService: HistoryService,
    @Inject() private readonly langfuseService: LangfuseService,
  ) {}

  async generateText(text: string, systemPrompt: string) {
    try {
      const chatAgent = this.aiAgentFactory.createDefaultChatAgent(
        systemPrompt,
        text,
      );
      const result = await chatAgent.invoke({});
      return {
        response: result,
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
    const { message, runtimePromptVariables, chatId, runtimeApiVariables } =
      chatRequest;

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

    const langfuseCallBack = new LangfuseCallbackHandler(trace);

    try {
      const chatHistory = await this.historyService.getHistoryForAgent(chatId);
      const agentExecutor = await this.aiAgentFactory.create(
        agentId,
        runtimePromptVariables,
        runtimeApiVariables,
      );
      const result = await agentExecutor.invoke(
        { input: message, chat_history: chatHistory },
        { callbacks: [langfuseCallBack] },
      );
      let output = result.output;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (!output || output?.trim() === '') {
        // Now, let's find out why it was empty.
        // The generation info is often nested in the full chain output.
        // This requires inspecting your specific log structure for the result.
        // Let's assume the LLM result is accessible somewhere in the response.
        const generationInfo = this._findGenerationInfo(result);

        if (generationInfo?.finishReason === 'SAFETY') {
          this.logger.warn('LLM response was blocked due to safety filters.');
          output =
            'I am sorry, but I cannot process that request as it may have triggered content safety filters. Please try rephrasing your query.';
          trace
            .span({
              level: 'WARNING',
              statusMessage: 'Blocked by safety filter',
            })
            .end();
        } else {
          this.logger.warn(
            'LLM returned an empty or null response for an unknown reason.',
            { generationInfo, result },
          );
          output =
            'I am sorry, but I was unable to generate a response. Please try again.';
          trace.span({ level: 'ERROR', statusMessage: 'Empty LLM response' });
        }
      }

      await this.historyService.addTurn(chatId, message, output);
      trace
        .span({
          level: 'DEBUG',
          output: output,
          input: message,
          endTime: new Date(),
        })
        .end();
      langfuseCallBack.endRootSpan(result.output);

      return result;
    } catch (error) {
      trace
        .span({
          level: 'ERROR',
          input: message,
          endTime: new Date(),
          statusMessage: (error as Error).message,
          metadata: {
            fullError: error,
          },
        })
        .end();
      langfuseCallBack.endRootSpan(undefined, error);
      throw new InternalServerErrorException(error);
    } finally {
      await this.langfuseService.shutdown();
    }
  }

  private _findGenerationInfo(result: any): { finishReason?: string } | null {
    // This is a common pattern, but you should log your `fullResult` to confirm
    if (
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      result.intermediate_steps?.[0]?.observation?.generations?.[0]?.[0]
        ?.generationInfo
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return result.intermediate_steps[0]?.observation?.generations?.[0]?.[0]
        ?.generationInfo;
    }
    // Check other possible locations
    return null;
  }
}
