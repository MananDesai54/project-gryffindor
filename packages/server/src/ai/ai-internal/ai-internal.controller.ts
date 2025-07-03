import { Controller, Post } from '@nestjs/common';
import { AiInternalService } from './ai-internal.service';

@Controller('ai/internal')
export class AiInternalController {
  constructor(private readonly aiInternalService: AiInternalService) {}

  @Post('/llm/create-standard-llms')
  async createStandardLLMs() {
    return this.aiInternalService.createStandardLLMs();
  }
}
