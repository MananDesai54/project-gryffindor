import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StandardLLM } from '../schema/llm.schema';
import { LLMType } from '../types/ai';
import { Model } from 'mongoose';
import { LLMConstants } from '../constant/llm.constants';
import { map } from 'lodash';
import { SystemUserConstant } from 'src/common/constant/systemUser.constant';

@Injectable()
export class AiInternalService {
  constructor(
    @InjectModel(LLMType.STANDARD) private readonly stdLLM: Model<StandardLLM>,
  ) {}

  async createStandardLLMs() {
    try {
      const models = await this.stdLLM.insertMany(
        map(LLMConstants.STANDARD_MODELS, (m) => ({
          ...m,
          creator: SystemUserConstant.SYSTEM_USER_ID,
        })),
      );
      return models;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
