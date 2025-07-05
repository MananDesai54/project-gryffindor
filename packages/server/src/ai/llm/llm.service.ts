import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthContextType } from 'src/auth/dto/auth.dto';
import { SearchRequestDto } from 'src/core/rest/request/request.dto';
import { SearchResponse } from 'src/core/rest/request/request.type';
import { RequestUtil } from 'src/core/rest/request/request.util';
import { CreateLLMDto, UpdateLLMDto } from './dto/llm.dto';
import { LLM } from './schema/llm.schema';
import { LLMType } from './types/llm.type';
import { CRUDService } from 'src/core/rest/crud.controller';
import { SearchService } from 'src/core/rest/search.controller';

@Injectable()
export class LlmService implements CRUDService<LLM>, SearchService<LLM> {
  constructor(@InjectModel(LLM.name) private readonly llm: Model<LLM>) {}

  async create(data: CreateLLMDto, authContext: AuthContextType) {
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

  async read(id: string) {
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

  async update(
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

  async delete(id: string, authContext: AuthContextType) {
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

  async search(request: SearchRequestDto): Promise<SearchResponse> {
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

  async count(request: SearchRequestDto): Promise<number> {
    try {
      const { query } = RequestUtil.getMongoQueryAndOptionsForRequest(request);
      return this.llm.countDocuments(query).exec();
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
}
