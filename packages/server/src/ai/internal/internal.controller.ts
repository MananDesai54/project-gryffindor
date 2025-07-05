import { Controller, Post } from '@nestjs/common';
import { InternalService } from './internal.service';

@Controller('ai/internal')
export class InternalController {
  constructor(private readonly aiInternalService: InternalService) {}

  @Post('/llm/create-standard-llms')
  async createStandardLLMs() {
    return this.aiInternalService.createStandardLLMs();
  }
}
