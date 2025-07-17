import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CRUDService } from '../core/rest/crud.controller';
import { SearchService } from '../core/rest/search.controller';
import { AIWorkflow } from './schema/ai-workflow.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthContextType } from 'src/auth/dto/auth.dto';
import {
  SearchRequest,
  SearchResponse,
} from 'src/core/rest/request/request.type';
import {
  CreateAIWorkflowDto,
  UpdateAiWorkflowDto,
} from './dto/ai-workflow.dto';
import { RequestUtil } from 'src/core/rest/request/request.util';

@Injectable()
export class AiWorkflowService
  implements CRUDService<AIWorkflow>, SearchService<AIWorkflow>
{
  constructor(
    @InjectModel(AIWorkflow.name)
    private readonly aiWorkflowModel: Model<AIWorkflow>,
  ) {}

  async create(
    data: CreateAIWorkflowDto,
    ctx: AuthContextType,
  ): Promise<AIWorkflow> {
    try {
      const aiWorkflow = await this.aiWorkflowModel.create({
        ...data,
        creator: ctx.userId,
      });

      return aiWorkflow;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async read(id: string): Promise<AIWorkflow> {
    try {
      const aiWorkflow = await this.aiWorkflowModel.findById(id).exec();
      if (!aiWorkflow)
        throw new NotFoundException(`AI Workflow with id ${id} not found`);
      return aiWorkflow;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async delete(id: string, ctx: AuthContextType): Promise<AIWorkflow> {
    try {
      const aiWorkflow = await this.aiWorkflowModel.findOneAndDelete({
        _id: id,
        creator: ctx.userId,
      });
      if (!aiWorkflow) {
        throw new BadRequestException(
          'You cannot delete this workflow. Either you do not own it or it does not exist.',
        );
      }
      return aiWorkflow;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(
    id: string,
    data: Partial<UpdateAiWorkflowDto>,
    ctx: AuthContextType,
  ): Promise<AIWorkflow> {
    try {
      const tool = await this.aiWorkflowModel.findOneAndUpdate(
        {
          _id: id,
          creator: ctx.userId,
        },
        data,
        { runValidators: true, new: true },
      );
      if (!tool) {
        throw new ForbiddenException('Ai Workflow not found');
      }
      return tool;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async search(
    searchRequest: Partial<SearchRequest>,
    ctx?: AuthContextType,
  ): Promise<SearchResponse<AIWorkflow>> {
    try {
      const { query, options } = RequestUtil.getMongoQueryAndOptionsForRequest(
        searchRequest,
        ctx,
      );

      const [aiWorkflows, count] = await Promise.all([
        this.aiWorkflowModel.find(query, null, options).exec(),
        this.aiWorkflowModel.countDocuments(query).exec(),
      ]);

      return {
        pageInfo: searchRequest?.pageInfo,
        data: aiWorkflows,
        count: count,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async count(
    searchRequest: Partial<SearchRequest>,
    ctx?: AuthContextType,
  ): Promise<number> {
    try {
      const { query } = RequestUtil.getMongoQueryAndOptionsForRequest(
        searchRequest,
        ctx,
      );

      return this.aiWorkflowModel.countDocuments(query).exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
