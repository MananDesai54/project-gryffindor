import {
  BadRequestException,
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
import { CreateAiAgentDto, UpdateAiAgentDto } from './dto/ai-agent.dto';
import { AiAgent } from './schema/ai-agent.schema';

@Injectable()
export class AiAgentService
  implements CRUDService<AiAgent>, SearchService<AiAgent>
{
  constructor(
    @InjectModel(AiAgent.name) private readonly aiAgent: Model<AiAgent>,
  ) {}

  async create(
    createAiAgentDto: CreateAiAgentDto,
    authContext: AuthContextType,
  ) {
    try {
      return this.aiAgent.create({
        ...createAiAgentDto,
        creator: authContext.userId,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async read(id: string) {
    try {
      const agent = await this.aiAgent.findById(id).exec();
      if (!agent) throw new NotFoundException(`Agent with id ${id} not found`);
      return agent;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(
    id: string,
    updateAiAgentDto: Partial<UpdateAiAgentDto>,
    authContext: AuthContextType,
  ) {
    try {
      const agent = await this.aiAgent
        .findOneAndUpdate(
          {
            _id: id,
            creator: authContext.userId,
          },
          updateAiAgentDto,
          { runValidators: true, new: true },
        )
        .exec();

      if (!agent)
        throw new NotFoundException(
          'You cannot update this agent. Either you do not own it or it does not exist.',
        );
      return agent;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async delete(id: string, authContext: AuthContextType) {
    try {
      const agent = await this.aiAgent.findOneAndDelete({
        _id: id,
        creator: authContext.userId,
      });
      if (!agent) {
        throw new BadRequestException(
          'You cannot delete this agent. Either you do not own it or it does not exist.',
        );
      }
      return agent;
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

      const [agents, count] = await Promise.all([
        this.aiAgent.find(query, null, options).exec(),
        this.aiAgent.countDocuments(query).exec(),
      ]);

      return {
        pageInfo: request.pageInfo,
        data: agents,
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

      return this.aiAgent.countDocuments(query).exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
