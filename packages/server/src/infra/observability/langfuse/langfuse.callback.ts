import { BaseCallbackHandler } from '@langchain/core/callbacks/base';
// import {
//   ChainValues,
//   LLMResult,
//   Serialized,
// } from '@langchain/core/tracers/schemas';
// import Langfuse, { Span, Trace } from 'langfuse-node';

export class LangfuseCallbackHandler extends BaseCallbackHandler {
  name: string;
  constructor(name: string) {
    super();
    this.name = name;
  }
  // name = 'CustomLangfuseCallbackHandler';
  // private rootTrace: Trace;
  // private spanStack: Span[] = [];
  // constructor(rootTrace: Trace) {
  //   super();
  //   this.rootTrace = rootTrace;
  // }
  // private getCurrentSpan(): Span {
  //   return this.spanStack[this.spanStack.length - 1] ?? this.rootTrace;
  // }
  // async handleLLMStart(llm: Serialized, prompts: string[]): Promise<void> {
  //   const generation = this.getCurrentSpan().generation({
  //     name: llm.id[llm.id.length - 1] as string,
  //     prompt: prompts[0],
  //   });
  //   this.spanStack.push(generation);
  // }
  // async handleLLMEnd(output: LLMResult): Promise<void> {
  //   const generation = this.spanStack.pop() as any; // Cast to 'any' to access end()
  //   if (generation?.id) {
  //     generation.end({
  //       output: output.generations[0][0].text,
  //       usage: {
  //         promptTokens: output.llmOutput?.tokenUsage?.promptTokens,
  //         completionTokens: output.llmOutput?.tokenUsage?.completionTokens,
  //       },
  //     });
  //   }
  // }
  // async handleToolStart(tool: Serialized, input: string): Promise<void> {
  //   const span = this.getCurrentSpan().span({
  //     name: tool.id[tool.id.length - 1] as string,
  //     input,
  //   });
  //   this.spanStack.push(span);
  // }
  // async handleToolEnd(output: string): Promise<void> {
  //   const span = this.spanStack.pop() as any;
  //   if (span?.id) {
  //     span.end({ output });
  //   }
  // }
}
