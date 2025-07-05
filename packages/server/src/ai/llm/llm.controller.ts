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
import { SearchRequestDto } from 'src/core/request/request.dto';
import { LlmService } from './llm.service';
import { AuthGuard } from 'src/core/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('ai/llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Post('/create')
  async createLLM(
    @Body(ValidationPipe) data: CreateLLMDto,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.llmService.createLLM(data, ctx);
  }

  @Post('/list')
  async listLLM(@Body(ValidationPipe) request: SearchRequestDto) {
    return this.llmService.list(request);
  }

  @Get('/:id')
  async getLLM(@Param('id') id: string) {
    return this.llmService.findLLMById(id);
  }

  @Delete('/:id')
  async deleteLLM(
    @Param('id') id: string,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.llmService.deleteLLM(id, ctx);
  }

  @Put('/:id')
  async updateLLM(
    @Param('id') id: string,
    @Body(ValidationPipe) data: Partial<UpdateLLMDto>,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.llmService.updateLLM(id, data, ctx);
  }
}
