import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateAiAgentDto, UpdateAiAgentDto } from './dto/ai-agent.dto';
import { AuthContext } from 'src/core/decorators/authContext';
import { AuthContextType } from 'src/auth/dto/auth.dto';
import { AiAgentService } from './ai-agent.service';
import { SearchRequestDto } from 'src/core/request/request.dto';
import { AuthGuard } from 'src/core/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('ai/agent')
export class AiAgentController {
  constructor(private readonly aiAgentService: AiAgentService) {}

  @Post('/create')
  async createAgent(
    @Body(ValidationPipe) data: CreateAiAgentDto,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.aiAgentService.createAgent(data, ctx);
  }

  @Post('/list')
  async listAgent(
    @Body(ValidationPipe) request: SearchRequestDto,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.aiAgentService.list(request, ctx);
  }

  @Delete('/:id')
  async deleteAgent(
    @Param('id') id: string,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.aiAgentService.deleteAgent(id, ctx);
  }

  @Get('/:id')
  async getAgent(@Param('id') id: string) {
    return this.aiAgentService.findAgentById(id);
  }

  @Put('/:id')
  async updateAgent(
    @Param('id') id: string,
    @Body(ValidationPipe) data: Partial<UpdateAiAgentDto>,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.aiAgentService.updateAgent(id, data, ctx);
  }
}
