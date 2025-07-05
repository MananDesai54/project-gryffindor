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
import { CreateLLMDto, UpdateLLMDto } from './dto/llm.dto';
import { AuthContextType } from 'src/auth/dto/auth.dto';
import { AuthContext } from 'src/core/decorators/authContext';
import { SearchRequestDto } from 'src/core/rest/request/request.dto';
import { LlmService } from './llm.service';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { CRUDController } from 'src/core/rest/crud.controller';
import { SearchController } from 'src/core/rest/search.controller';
import { LLM } from './schema/llm.schema';

@UseGuards(AuthGuard)
@Controller('ai/llm')
export class LlmController
  implements CRUDController<LLM>, SearchController<LLM>
{
  constructor(private readonly llmService: LlmService) {}

  @Post('/create')
  async create(
    @Body(ValidationPipe) data: CreateLLMDto,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.llmService.create(data, ctx);
  }

  @Get('/:id')
  async read(@Param('id') id: string) {
    return this.llmService.read(id);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string, @AuthContext() ctx: AuthContextType) {
    return this.llmService.delete(id, ctx);
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) data: Partial<UpdateLLMDto>,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.llmService.update(id, data, ctx);
  }

  @Post('/search')
  async search(@Body(ValidationPipe) request: SearchRequestDto) {
    return this.llmService.search(request);
  }

  @Post('/count')
  async count(@Body(ValidationPipe) request: SearchRequestDto) {
    return this.llmService.count(request);
  }
}
