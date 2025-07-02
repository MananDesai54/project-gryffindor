import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthContextType } from 'src/auth/dto/auth.dto';
import { CreateAiAgentDto, UpdateAiAgentDto } from '../dto/ai.dto';
import { AiAgent } from '../schema/aiAgent.schema';

@Injectable()
export class AiAgentService {
  constructor(
    @InjectModel(AiAgent.name) private readonly aiAgent: Model<AiAgent>,
  ) {}

  async createAgent(
    createAiAgentDto: CreateAiAgentDto,
    authContext: AuthContextType,
  ) {
    try {
      const createdAiAgent = new this.aiAgent({
        ...createAiAgentDto,
        creator: authContext.userId,
      });
      return createdAiAgent.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAgentById(id: string) {
    try {
      const agent = await this.aiAgent.findById(id).exec();
      if (!agent) throw new NotFoundException(`Agent with id ${id} not found`);
      return agent;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateAgent(
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

  async deleteAgent(id: string, authContext: AuthContextType) {
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
      return this.aiAgent.deleteOne({ _id: id });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
