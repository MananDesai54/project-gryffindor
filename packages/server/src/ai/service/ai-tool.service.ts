import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { merge } from 'lodash';
import { Model } from 'mongoose';
import { AuthContextType } from 'src/auth/dto/auth.dto';
import { CreateAiToolDto, UpdateAiToolDto } from '../dto/aiTool.dto';
import { AgentAiTool, AiTool, WebhookAiTool } from '../schema/aiTool.schema';
import { AiToolType } from '../types/ai';

@Injectable()
export class AiToolService {
  constructor(
    @InjectModel(AiToolType.WEB_HOOK)
    private readonly webHookModel: Model<WebhookAiTool>,
    @InjectModel(AiToolType.AGENT)
    private readonly agentAiToolModel: Model<AgentAiTool>,
    @InjectModel(AiTool.name) private readonly aiToolModel: Model<AiTool>,
  ) {}

  async createAiTool(data: CreateAiToolDto, authContext: AuthContextType) {
    try {
      const { type } = data;
      const updatedData = {
        ...data,
        creator: authContext.userId,
      };
      switch (type as AiToolType) {
        case AiToolType.WEB_HOOK:
          return this.webHookModel.create(updatedData);
        case AiToolType.AGENT:
          return this.agentAiToolModel.create(updatedData);
        default:
          throw new InternalServerErrorException('Invalid AI tool type');
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateAiTool(
    id: string,
    data: Partial<UpdateAiToolDto>,
    authContext: AuthContextType,
  ) {
    try {
      const tool = await this.aiToolModel.findOne({
        _id: id,
        creator: authContext.userId,
      });
      if (!tool) {
        throw new ForbiddenException('Ai tool not found');
      }
      merge(tool, data);
      const updatedTool = await tool.save();
      return updatedTool;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteAiTool(id: string, authContext: AuthContextType) {
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
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAiTool(id: string) {
    try {
      const tool = await this.aiToolModel.findById(id);
      if (!tool) {
        throw new NotFoundException('Ai tool not found');
      }
      return tool;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
