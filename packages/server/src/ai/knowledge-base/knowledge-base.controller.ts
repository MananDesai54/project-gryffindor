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
import { SearchRequestDto } from 'src/core/request/request.dto';

@UseGuards(AuthGuard)
@Controller('ai/knowledge-base')
export class KnowledgeBaseController {
  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}

  @Post('/create')
  async createKb(
    @Body(ValidationPipe) data: CreateKnowledgeBaseDto,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.knowledgeBaseService.createKnowledgeBase(data, ctx);
  }

  @Post('/list')
  async listKb(
    @Body(ValidationPipe) request: SearchRequestDto,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.knowledgeBaseService.list(request, ctx);
  }

  @Get('/:id')
  async getKb(@Param('id') id: string) {
    return this.knowledgeBaseService.findKnowledgeBaseById(id);
  }

  @Delete('/:id')
  async deleteKb(@Param('id') id: string, @AuthContext() ctx: AuthContextType) {
    return this.knowledgeBaseService.deleteKnowledgeBase(id, ctx);
  }

  @Put('/:id')
  async updateKb(
    @Param('id') id: string,
    @Body(ValidationPipe) data: Partial<UpdateKnowledgeBaseDto>,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.knowledgeBaseService.updateKnowledgeBase(id, data, ctx);
  }
}
