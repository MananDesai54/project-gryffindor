import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ChatRequestDto,
  GenerateSystemPromptDto,
  GenerateTextDto,
} from './dto/inference.dto';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { InferenceService } from './inference.service';
import { AiAgentService } from '../ai-agent/ai-agent.service';
import { LlmService } from '../llm/llm.service';
import { AiToolService } from '../ai-tool/ai-tool.service';
import { LLMConstants } from '../llm/constant/llm.constants';

@UseGuards(AuthGuard)
@Controller('ai/inference')
export class InferenceController {
  constructor(
    private readonly inferenceService: InferenceService,
    private readonly aiAgentService: AiAgentService,
    private readonly llmService: LlmService,
    private readonly aiToolService: AiToolService,
  ) {}

  @Post('/generate-text')
  async generateText(@Body(ValidationPipe) body: GenerateTextDto) {
    return this.inferenceService.generateText(body.text, body.systemPrompt);
  }

  @Post('/generate-text/system-prompt')
  async generateTextSystemPrompt(
    @Body(ValidationPipe) body: GenerateSystemPromptDto,
  ) {
    return this.inferenceService.generateText(
      body.text,
      LLMConstants.SYSTEM_PROMPT_FOR_SYSTEM_PROMPT_GENERATOR,
    );
  }

  @Post('/chat/:agentId')
  async chat(
    @Param('agentId') agentId: string,
    @Body(ValidationPipe) body: ChatRequestDto,
    // @AuthContext() authContext: AuthContextType,
  ) {
    const aiAgent = await this.aiAgentService.read(agentId);
    const llmDetails = aiAgent.configuration?.llm
      ? await this.llmService.read(aiAgent.configuration?.llm)
      : LLMConstants.DEFAULT_MODEL;
    const toolsDetails = aiAgent.configuration?.customTools?.length
      ? await this.aiToolService.findMany(aiAgent.configuration?.customTools)
      : [];

    const output = await this.inferenceService.chat(
      agentId,
      body,
      aiAgent,
      llmDetails,
      toolsDetails,
    );

    return output;
  }
}
