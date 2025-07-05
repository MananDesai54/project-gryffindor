import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { LLMConstants } from '../llm/constant/llm.constants';
import { SystemUserConstant } from 'src/core/constant/systemUser.constant';

@Injectable()
export class InternalService {
  constructor(@Inject() private readonly llmService: LlmService) {}

  async createStandardLLMs() {
    try {
      return this.llmService.createManyLLMs(LLMConstants.STANDARD_MODELS, {
        userId: SystemUserConstant.SYSTEM_USER_ID.toString(),
        email: SystemUserConstant.SYSTEM_USER_EMAIL,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
