import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '../../core/guard/auth.guard';
import { LLMConstants } from '../llm/constant/llm.constants';
import {
  ChatRequestDto,
  GenerateSystemPromptDto,
  GenerateTextDto,
} from './dto/inference.dto';
import { InferenceService } from './inference.service';

@UseGuards(AuthGuard)
@Controller('ai/inference')
export class InferenceController {
  constructor(private readonly inferenceService: InferenceService) {}

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
    const output = await this.inferenceService.chat(agentId, body);

    return output;
  }
}
