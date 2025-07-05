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
import { SearchRequestDto } from 'src/core/rest/request/request.dto';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { CRUDController } from 'src/core/rest/crud.controller';
import { SearchController } from 'src/core/rest/search.controller';
import { AiAgent } from './schema/ai-agent.schema';

@UseGuards(AuthGuard)
@Controller('ai/agent')
export class AiAgentController
  implements CRUDController<AiAgent>, SearchController<AiAgent>
{
  constructor(private readonly aiAgentService: AiAgentService) {}

  @Post('/create')
  async create(
    @Body(ValidationPipe) data: CreateAiAgentDto,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.aiAgentService.create(data, ctx);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string, @AuthContext() ctx: AuthContextType) {
    return this.aiAgentService.delete(id, ctx);
  }

  @Get('/:id')
  async read(@Param('id') id: string) {
    return this.aiAgentService.read(id);
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) data: Partial<UpdateAiAgentDto>,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.aiAgentService.update(id, data, ctx);
  }

  @Post('/search')
  async search(
    @Body(ValidationPipe) request: SearchRequestDto,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.aiAgentService.search(request, ctx);
  }

  @Post('/count')
  async count(
    @Body(ValidationPipe) request: SearchRequestDto,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.aiAgentService.count(request, ctx);
  }
}
