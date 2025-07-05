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
import { CreateAiToolDto, UpdateAiToolDto } from './dto/ai-tool.dto';
import { AuthContextType } from 'src/auth/dto/auth.dto';
import { AuthContext } from 'src/core/decorators/authContext';
import { SearchRequestDto } from 'src/core/rest/request/request.dto';
import { AiToolService } from './ai-tool.service';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { CRUDController } from 'src/core/rest/crud.controller';
import { SearchController } from 'src/core/rest/search.controller';
import { AiTool } from './schema/ai-tool.schema';

@UseGuards(AuthGuard)
@Controller('ai/tool')
export class AiToolController
  implements CRUDController<AiTool>, SearchController<AiTool>
{
  constructor(private readonly aiToolService: AiToolService) {}

  @Post('/create')
  async create(
    @Body(ValidationPipe) data: CreateAiToolDto,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.aiToolService.create(data, ctx);
  }

  @Get('/:id')
  async read(@Param('id') id: string) {
    return this.aiToolService.read(id);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string, @AuthContext() ctx: AuthContextType) {
    return this.aiToolService.delete(id, ctx);
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) data: Partial<UpdateAiToolDto>,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.aiToolService.update(id, data, ctx);
  }

  @Post('/search')
  async search(
    @Body(ValidationPipe) request: SearchRequestDto,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.aiToolService.search(request, ctx);
  }

  @Post('/count')
  async count(
    @Body(ValidationPipe) request: SearchRequestDto,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.aiToolService.count(request, ctx);
  }
}
