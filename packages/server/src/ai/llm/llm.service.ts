import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthContextType } from 'src/auth/dto/auth.dto';
import { SearchRequestDto } from 'src/core/request/request.dto';
import { SearchResponse } from 'src/core/request/request.type';
import { RequestUtil } from 'src/core/request/request.util';
import { CreateLLMDto, UpdateLLMDto } from './dto/llm.dto';
import { LLM } from './schema/llm.schema';
import { LLMType } from './types/llm.type';

@Injectable()
export class LlmService {
  constructor(@InjectModel(LLM.name) private readonly llm: Model<LLM>) {}

  async createLLM(data: CreateLLMDto, authContext: AuthContextType) {
    try {
      const updatedData = {
        ...data,
        creator: authContext.userId,
      };
      return this.llm.create(updatedData);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createManyLLMs(
    data: Partial<CreateLLMDto>[],
    authContext: AuthContextType,
  ) {
    try {
      const models = await this.llm.insertMany(
        data.map((item) => ({
          ...item,
          creator: authContext.userId,
        })),
      );
      return models;
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
