import { Body, Controller, Inject, Post, ValidationPipe } from '@nestjs/common';
import { GenerateTextDto } from './dto/inference.dto';
import { InferenceService } from './inference.service';

@Controller('ai/inference')
export class InferenceController {
  constructor(@Inject() private readonly inferenceService: InferenceService) {}

  @Post('/generate-text')
  generateText(@Body(ValidationPipe) body: GenerateTextDto) {
    return this.inferenceService.generateText(body.text);
  }
}
