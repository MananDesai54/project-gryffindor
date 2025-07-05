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
import { SearchRequestDto } from 'src/core/request/request.dto';
import { AiToolService } from './ai-tool.service';
import { AuthGuard } from 'src/core/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('ai/tool')
export class AiToolController {
  constructor(private readonly aiToolService: AiToolService) {}

  @Post('/create')
  async createAiTool(
    @Body(ValidationPipe) data: CreateAiToolDto,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.aiToolService.createAiTool(data, ctx);
  }

  @Post('/list')
  async listTool(
    @Body(ValidationPipe) request: SearchRequestDto,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.aiToolService.list(request, ctx);
  }

  @Get('/:id')
  async getAiTool(@Param('id') id: string) {
    return this.aiToolService.getAiTool(id);
  }

  @Delete('/:id')
  async deleteAiTool(
    @Param('id') id: string,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.aiToolService.deleteAiTool(id, ctx);
  }

  @Put('/:id')
  async updateAiTool(
    @Param('id') id: string,
    @Body(ValidationPipe) data: Partial<UpdateAiToolDto>,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.aiToolService.updateAiTool(id, data, ctx);
  }
}
