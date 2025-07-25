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
import { CRUDController } from '../core/rest/crud.controller';
import { SearchController } from '../core/rest/search.controller';
import { AiWorkflowService } from './ai-workflow.service';
import { AIWorkflow } from './schema/ai-workflow.schema';
import { AuthContext } from '../core/decorators/authContext';
import { AuthContextType } from '../auth/dto/auth.dto';
import { SearchRequestDto } from '../core/rest/request/request.dto';
import {
  CreateAIWorkflowDto,
  UpdateAiWorkflowDto,
} from './dto/ai-workflow.dto';
import { AuthGuard } from 'src/core/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('ai-workflow')
export class AiWorkflowController
  implements CRUDController<AIWorkflow>, SearchController<AIWorkflow>
{
  constructor(private readonly aiWorkflowService: AiWorkflowService) {}

  @Post('/create')
  async create(
    @Body(ValidationPipe) data: CreateAIWorkflowDto,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.aiWorkflowService.create(data, ctx);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string, @AuthContext() ctx: AuthContextType) {
    return this.aiWorkflowService.delete(id, ctx);
  }

  @Get('/:id')
  async read(@Param('id') id: string) {
    return this.aiWorkflowService.read(id);
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) data: Partial<UpdateAiWorkflowDto>,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.aiWorkflowService.update(id, data, ctx);
  }

  @Post('/search')
  async search(
    @Body(ValidationPipe) request: SearchRequestDto,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.aiWorkflowService.search(request, ctx);
  }

  @Post('/count')
  async count(
    @Body(ValidationPipe) request: SearchRequestDto,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.aiWorkflowService.count(request, ctx);
  }
}
