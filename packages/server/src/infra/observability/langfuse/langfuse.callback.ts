import { BaseCallbackHandler } from '@langchain/core/callbacks/base';
import { Serialized } from '@langchain/core/load/serializable';
import { LLMResult } from '@langchain/core/outputs';
import Langfuse, {
  LangfuseGenerationClient,
  LangfuseSpanClient,
  LangfuseTraceClient,
} from 'langfuse-node';
import { AuthContextType } from 'src/auth/dto/auth.dto';

export class LangfuseCallbackHandler extends BaseCallbackHandler {
  name = 'LangfuseCallbackHandler';

  private spanStack: LangfuseSpanClient[] = [];
  private generationStack: LangfuseGenerationClient[] = [];

  constructor(
    private readonly trace: LangfuseTraceClient,
    private readonly langfuse: Langfuse,
    private readonly authContext?: AuthContextType,
  ) {
    super();
  }

  private get aCurrentSpan(): LangfuseTraceClient | LangfuseSpanClient {
    return this.spanStack[this.spanStack.length - 1] ?? this.trace;
  }

  private get aCurrentGeneration(): LangfuseGenerationClient {
    return (
      this.generationStack[this.generationStack.length - 1] ??
      this.langfuse.generation({})
    );
  }

  // --- LLM Events ---

  handleLLMStart(llm: Serialized, prompts: string[]) {
    const modelName = llm.id[llm.id.length - 1];

    const generation = this.aCurrentGeneration.generation({
      input: prompts.join('\n'),
      metadata: {
        modelName,
      },
      level: 'DEBUG',
      name: 'LLM Start Generation',
      completionStartTime: new Date(),
      // prompt: {
      //   prompt: [
      //     { content: prompts.join('\n'), type: 'chatmessage', role: 'user' },
      //   ],
      //   type: 'chat',
      // },
    });
    this.spanStack.push(generation);
  }

  handleLLMEnd(output: LLMResult) {
    const generation = this.spanStack.pop();
    // Logger.log(output);
    if (generation?.id) {
      generation.end({
        output: output.generations[0][0].text,
        // @ts-ignore
        usageDetails: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          promptTokens: output.llmOutput?.tokenUsage?.promptTokens,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          completionTokens: output.llmOutput?.tokenUsage?.completionTokens,
        },
      });
    }
  }

  handleToolStart(tool: Serialized, input: string) {
    const toolName = tool.id[tool.id.length - 1];

    const span = this.aCurrentSpan.span({
      name: toolName,
      input,
      startTime: new Date(),
      level: 'DEBUG',
      metadata: {
        tool,
      },
    });
    this.spanStack.push(span);
  }

  handleToolEnd(output: string) {
    const span = this.spanStack.pop();
    if (span?.id) {
      span.end({ output, level: 'DEBUG' });
    }
  }

  // --- Error Handling ---

  handleChainError(err: Error) {
    const span = this.spanStack.pop();
    if (span?.id) {
      span.end({
        level: 'ERROR',
        statusMessage: err.message,
      });
    }
  }

  handleToolError(err: Error) {
    const span = this.spanStack.pop();
    if (span?.id) {
      span.end({
        level: 'ERROR',
        statusMessage: err.message,
      });
    }
  }
}
