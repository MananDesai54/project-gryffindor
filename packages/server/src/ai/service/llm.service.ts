import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthContextType } from 'src/auth/dto/auth.dto';
import { CreateLLMDto, UpdateLLMDto } from '../dto/llm.dto';
import { CustomLLM, LLM, StandardLLM } from '../schema/llm.schema';
import { LLMType } from '../types/ai';
import { SearchRequestDto } from 'src/common/request/request.dto';
import { RequestUtil } from 'src/common/request/request.util';
import { SearchResponse } from 'src/common/request/request.type';

@Injectable()
export class LlmService {
  constructor(
    @InjectModel(LLMType.STANDARD) private readonly stdLLM: Model<StandardLLM>,
    @InjectModel(LLMType.CUSTOM) private readonly customLLM: Model<CustomLLM>,
    @InjectModel(LLM.name) private readonly llm: Model<LLM>,
  ) {}

  async createLLM(data: CreateLLMDto, authContext: AuthContextType) {
    try {
      const updatedData = {
        ...data,
        creator: authContext.userId,
      };
      switch (data.type as LLMType) {
        case LLMType.STANDARD:
          return this.stdLLM.create(updatedData);
        case LLMType.CUSTOM:
          return this.customLLM.create(updatedData);
        default:
          throw new InternalServerErrorException('Invalid LLM type');
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findLLMById(id: string) {
    try {
      const llm = await this.llm.findById(id);
      if (!llm) {
        throw new NotFoundException('LLM not found');
      }
      return llm;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateLLM(
    id: string,
    data: Partial<UpdateLLMDto>,
    authContext: AuthContextType,
  ) {
    try {
      const llm = await this.llm.findOneAndUpdate(
        {
          _id: id,
          type: LLMType.CUSTOM,
          creator: authContext.userId,
        },
        data,
        { new: true, runValidators: true },
      );

      if (!llm) {
        throw new BadRequestException(
          'You cannot update this LLM. Either it does not exist or you do not have permission.',
        );
      }

      return llm;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteLLM(id: string, authContext: AuthContextType) {
    try {
      const llm = await this.llm.findOneAndDelete({
        _id: id,
        type: LLMType.CUSTOM,
        creator: authContext.userId,
      });
      if (!llm) {
        throw new BadRequestException(
          'You cannot delete this LLM. Either it does not exist or you do not have permission.',
        );
      }
      return llm;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async list(request: SearchRequestDto): Promise<SearchResponse> {
    try {
      const { query, options } =
        RequestUtil.getMongoQueryAndOptionsForRequest(request);

      const [llm, count] = await Promise.all([
        this.llm.find(query, null, options).exec(),
        this.llm.countDocuments(query).exec(),
      ]);

      return {
        pageInfo: request.pageInfo,
        data: llm,
        count: count,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
