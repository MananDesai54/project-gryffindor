import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthContextType } from 'src/auth/dto/auth.dto';
import { CRUDService } from 'src/core/rest/crud.controller';
import { SearchRequestDto } from 'src/core/rest/request/request.dto';
import { SearchResponse } from 'src/core/rest/request/request.type';
import { RequestUtil } from 'src/core/rest/request/request.util';
import { SearchService } from 'src/core/rest/search.controller';
import { CreateAiToolDto, UpdateAiToolDto } from './dto/ai-tool.dto';
import { AiTool } from './schema/ai-tool.schema';

@Injectable()
export class AiToolService
  implements CRUDService<AiTool>, SearchService<AiTool>
{
  constructor(
    @InjectModel(AiTool.name) private readonly aiToolModel: Model<AiTool>,
  ) {}

  async create(data: CreateAiToolDto, authContext: AuthContextType) {
    try {
      const updatedData = {
        ...data,
        creator: authContext.userId,
      };
      return await this.aiToolModel.create(updatedData);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(
    id: string,
    data: Partial<UpdateAiToolDto>,
    authContext: AuthContextType,
  ) {
    try {
      const tool = await this.aiToolModel.findOneAndUpdate(
        {
          _id: id,
          creator: authContext.userId,
        },
        data,
        { runValidators: true, new: true },
      );
      if (!tool) {
        throw new ForbiddenException('Ai tool not found');
      }
      return tool;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async delete(id: string, authContext: AuthContextType) {
    try {
      const tool = await this.aiToolModel.findByIdAndDelete({
        _id: id,
        creator: authContext.userId,
      });
      if (!tool) {
        throw new ForbiddenException('Ai tool cannot be deleted');
      }
      return tool;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async read(id: string) {
    try {
      const tool = await this.aiToolModel.findById(id);
      if (!tool) {
        throw new NotFoundException('Ai tool not found');
      }
      return tool;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async search(
    request: SearchRequestDto,
    authContext: AuthContextType,
  ): Promise<SearchResponse> {
    try {
      const { query, options } = RequestUtil.getMongoQueryAndOptionsForRequest(
        request,
        authContext,
      );

      const [tool, count] = await Promise.all([
        this.aiToolModel.find(query, null, options).exec(),
        this.aiToolModel.countDocuments(query).exec(),
      ]);

      return {
        pageInfo: request.pageInfo,
        data: tool,
        count: count,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async count(
    request: SearchRequestDto,
    authContext: AuthContextType,
  ): Promise<number> {
    try {
      const { query } = RequestUtil.getMongoQueryAndOptionsForRequest(
        request,
        authContext,
      );

      return this.aiToolModel.countDocuments(query).exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findMany(ids: string[]) {
    try {
      const tools = await this.aiToolModel.find({ _id: { $in: ids } });
      if (!tools) {
        throw new NotFoundException('Ai tools not found');
      }
      return tools;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
