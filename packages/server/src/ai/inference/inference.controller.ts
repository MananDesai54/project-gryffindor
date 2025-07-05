import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ChatRequestDto, GenerateTextDto } from './dto/inference.dto';
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
  generateText(@Body(ValidationPipe) body: GenerateTextDto) {
    return this.inferenceService.generateText(body.text);
  }

  @Post('/chat/:agentId')
  async chat(
    @Param('agentId') agentId: string,
    @Body(ValidationPipe) body: ChatRequestDto,
    // @AuthContext() authContext: AuthContextType,
  ) {
    const aiAgent = await this.aiAgentService.findAgentById(agentId);
    const llmDetails = aiAgent.configuration?.llm
      ? await this.llmService.findLLMById(aiAgent.configuration?.llm)
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
