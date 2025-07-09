import { BaseCallbackHandler } from '@langchain/core/callbacks/base';
import {
  Serialized,
  SerializedConstructor,
} from '@langchain/core/load/serializable';
import { LLMResult } from '@langchain/core/outputs';
import { Logger } from '@nestjs/common';
import {
  LangfuseGenerationClient,
  LangfuseSpanClient,
  LangfuseTraceClient,
} from 'langfuse-node';
import { LLMConstants } from 'src/ai/llm/constant/llm.constants';

export class LangfuseCallbackHandler extends BaseCallbackHandler {
  private readonly logger = new Logger(LangfuseCallbackHandler.name);

  name = 'LangfuseCallbackHandler';
  llmName: string;

  private readonly spanStack: (
    | LangfuseSpanClient
    | LangfuseGenerationClient
  )[] = [];

  private readonly rootSpan: LangfuseSpanClient;

  constructor(private readonly trace: LangfuseTraceClient) {
    super();
    this.rootSpan = this.trace.span({ name: 'agent-execution' });
  }

  private getCurrentSpan(): LangfuseSpanClient | LangfuseTraceClient {
    return this.spanStack[this.spanStack.length - 1] || this.rootSpan;
  }

  handleLLMStart(llm: SerializedConstructor, prompts: string[]) {
    const modelName = llm.kwargs?.model as string;
    this.llmName = modelName;

    const generation = this.getCurrentSpan().generation({
      name: modelName,
      startTime: new Date(),
      input: prompts,
      model: modelName,
    });

    this.spanStack.push(generation);
  }

  handleLLMEnd(output: LLMResult) {
    try {
      const generation = this.spanStack.pop();

      if (!generation) {
        this.logger.warn(
          'Langfuse: Popped a non-generation from stack in handleLLMEnd.',
        );
        return;
      }

      this.logger.log(
        'LLM Output with Token Usage:',
        JSON.stringify(output.llmOutput, null, 2),
      );

      generation.end({
        output: output.generations[0][0].text,
        usage: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          promptTokens: output.llmOutput?.tokenUsage?.promptTokens,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          completionTokens: output.llmOutput?.tokenUsage?.completionTokens,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          input: output.llmOutput?.tokenUsage?.promptTokens,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          output: output.llmOutput?.tokenUsage?.completionTokens,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          totalTokens: output.llmOutput?.tokenUsage?.totalTokens,
          ...this._calculateCost(
            this.llmName,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            output.llmOutput?.tokenUsage?.promptTokens,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            output.llmOutput?.tokenUsage?.completionTokens,
          ),
          unit: 'TOKENS',
        },
        usageDetails: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          prompt_tokens: output.llmOutput?.tokenUsage?.promptTokens,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          completion_tokens: output.llmOutput?.tokenUsage?.completionTokens,
        },
      });
    } catch (error) {
      this.logger.error({ error: error as Error });
    }
  }

  handleToolStart(tool: Serialized, input: string) {
    const toolName = tool.id[tool.id.length - 1];

    const span = this.getCurrentSpan().span({
      name: toolName,
      input: input,
      startTime: new Date(),
    });

    this.spanStack.push(span);
  }

  handleToolEnd(output: string) {
    const span = this.spanStack.pop();
    if (!span) return;

    span.end({ output });
  }

  public endRootSpan(output?: string, error?: Error) {
    this.rootSpan.end({
      output,
      level: error ? 'ERROR' : 'DEFAULT',
      statusMessage: error?.message,
    });
  }

  private _calculateCost(
    modelName: string,
    promptTokens: number,
    completionTokens: number,
  ) {
    const pricing = LLMConstants.STANDARD_MODEL_PER_MILLION_COST_USD[modelName];

    if (!pricing) {
      this.logger.warn(
        `No pricing information found for model: ${modelName}. Cost will be reported as 0.`,
      );
      return 0;
    }

    const inputCost = (promptTokens / 1_000_000) * pricing.input;
    const outputCost = (completionTokens / 1_000_000) * pricing.output;

    const totalCost = inputCost + outputCost;

    return { totalCost, inputCost, outputCost };
  }
}
