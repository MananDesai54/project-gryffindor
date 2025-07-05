import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthContextType } from '../../auth/dto/auth.dto';
import { CRUDService } from '../../core/rest/crud.controller';
import { SearchRequestDto } from '../../core/rest/request/request.dto';
import { SearchResponse } from '../../core/rest/request/request.type';
import { RequestUtil } from '../../core/rest/request/request.util';
import { SearchService } from '../../core/rest/search.controller';
import {
  CreateKnowledgeBaseDto,
  UpdateKnowledgeBaseDto,
} from './dto/knowledge-base.dto';
import { KnowledgeBase } from './schema/knowledge-base.schema';

@Injectable()
export class KnowledgeBaseService
  implements CRUDService<KnowledgeBase>, SearchService<KnowledgeBase>
{
  constructor(
    @InjectModel(KnowledgeBase.name)
    private readonly knowledgeBaseModel: Model<KnowledgeBase>,
  ) {}

  async create(data: CreateKnowledgeBaseDto, authContext: AuthContextType) {
    try {
      const updatedData = {
        ...data,
        creator: authContext.userId,
      };
      return this.knowledgeBaseModel.create(updatedData);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async read(id: string) {
    try {
      const knowledgeBase = await this.knowledgeBaseModel.findById(id);
      if (!knowledgeBase) {
        throw new NotFoundException('Knowledge base not found');
      }
      return knowledgeBase;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(
    id: string,
    data: Partial<UpdateKnowledgeBaseDto>,
    authContext: AuthContextType,
  ) {
    try {
      const knowledgeBase = await this.knowledgeBaseModel.findOneAndUpdate(
        {
          _id: id,
          creator: authContext.userId,
        },
        data,
        { new: true, runValidators: true },
      );
      if (!knowledgeBase) {
        throw new NotFoundException(
          'You cannot update knowledge base. Either it does not exist or you are not the creator.',
        );
      }
      return knowledgeBase;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async delete(id: string, authContext: AuthContextType) {
    try {
      const knowledgeBase = await this.knowledgeBaseModel.findOneAndDelete({
        _id: id,
        creator: authContext.userId,
      });
      if (!knowledgeBase) {
        throw new NotFoundException(
          'You cannot delete knowledge base. Either it does not exist or you are not the creator.',
        );
      }

      return knowledgeBase;
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

      const [kb, count] = await Promise.all([
        this.knowledgeBaseModel.find(query, null, options).exec(),
        this.knowledgeBaseModel.countDocuments(query).exec(),
      ]);

      return {
        pageInfo: request.pageInfo,
        data: kb,
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

      return await this.knowledgeBaseModel.countDocuments(query).exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findMany(ids: string[]) {
    try {
      const knowledgeBases = await this.knowledgeBaseModel.find({
        _id: { $in: ids },
      });
      if (!knowledgeBases) {
        throw new NotFoundException('Knowledge bases not found');
      }
      return knowledgeBases;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
