import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthContextType } from 'src/auth/dto/auth.dto';
import { FilterType } from 'src/core/request/filters/filter.type';
import {
  FileKnowledgeBase,
  KnowledgeBase,
  LinkKnowledgeBase,
  TextKnowledgeBase,
} from './schema/knowledge-base.schema';
import {
  CreateKnowledgeBaseDto,
  UpdateKnowledgeBaseDto,
} from './dto/knowledge-base.dto';
import { KnowledgeBaseType } from './types/knowledge-base.type';
import { SearchRequestDto } from 'src/core/request/request.dto';
import { SearchResponse } from 'src/core/request/request.type';
import { RequestUtil } from 'src/core/request/request.util';

@Injectable()
export class KnowledgeBaseService {
  constructor(
    @InjectModel(KnowledgeBaseType.FILE)
    private readonly fileKnowledgeBaseModel: Model<FileKnowledgeBase>,
    @InjectModel(KnowledgeBaseType.LINK)
    private readonly linkKnowledgeBaseModel: Model<LinkKnowledgeBase>,
    @InjectModel(KnowledgeBaseType.TEXT)
    private readonly textKnowledgeBaseModel: Model<TextKnowledgeBase>,
    @InjectModel(KnowledgeBase.name)
    private readonly knowledgeBaseModel: Model<KnowledgeBase>,
  ) {}

  async createKnowledgeBase(
    data: CreateKnowledgeBaseDto,
    authContext: AuthContextType,
  ) {
    try {
      const updatedData = {
        ...data,
        creator: authContext.userId,
      };
      switch (data.type as KnowledgeBaseType) {
        case KnowledgeBaseType.FILE:
          return await this.fileKnowledgeBaseModel.create(updatedData);
        case KnowledgeBaseType.LINK:
          return await this.linkKnowledgeBaseModel.create(updatedData);
        case KnowledgeBaseType.TEXT:
          return await this.textKnowledgeBaseModel.create(updatedData);
        default:
          throw new Error('Invalid knowledge base type');
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findKnowledgeBaseById(id: string) {
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

  async updateKnowledgeBase(
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

  async deleteKnowledgeBase(id: string, authContext: AuthContextType) {
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

  async list(
    request: SearchRequestDto,
    authContext: AuthContextType,
  ): Promise<SearchResponse> {
    try {
      request = {
        ...request,
        filters: [
          ...(request.filters || []),
          {
            field: 'creator',
            value: [authContext.userId],
            filterType: FilterType.IN,
          },
        ],
      };
      const { query, options } =
        RequestUtil.getMongoQueryAndOptionsForRequest(request);

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
}
