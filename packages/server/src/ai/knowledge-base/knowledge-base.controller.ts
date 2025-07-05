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
import {
  CreateKnowledgeBaseDto,
  UpdateKnowledgeBaseDto,
} from './dto/knowledge-base.dto';
import { AuthContext } from 'src/core/decorators/authContext';
import { AuthContextType } from 'src/auth/dto/auth.dto';
import { KnowledgeBaseService } from './knowledge-base.service';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { SearchRequestDto } from 'src/core/rest/request/request.dto';
import { CRUDController } from 'src/core/rest/crud.controller';
import { SearchController } from 'src/core/rest/search.controller';
import { KnowledgeBase } from './schema/knowledge-base.schema';

@UseGuards(AuthGuard)
@Controller('ai/knowledge-base')
export class KnowledgeBaseController
  implements CRUDController<KnowledgeBase>, SearchController<KnowledgeBase>
{
  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}

  @Post('/create')
  async create(
    @Body(ValidationPipe) data: CreateKnowledgeBaseDto,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.knowledgeBaseService.create(data, ctx);
  }

  @Get('/:id')
  async read(@Param('id') id: string) {
    return this.knowledgeBaseService.read(id);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string, @AuthContext() ctx: AuthContextType) {
    return this.knowledgeBaseService.delete(id, ctx);
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) data: Partial<UpdateKnowledgeBaseDto>,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.knowledgeBaseService.update(id, data, ctx);
  }

  @Post('/search')
  async search(
    @Body(ValidationPipe) request: SearchRequestDto,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.knowledgeBaseService.search(request, ctx);
  }

  @Post('/count')
  async count(
    @Body(ValidationPipe) searchRequest: Partial<SearchRequestDto>,
    @AuthContext() ctx: AuthContextType,
  ): Promise<number> {
    return this.knowledgeBaseService.count(searchRequest, ctx);
  }
}
