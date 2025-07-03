import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthContext } from 'src/auth/decorators/authContext';
import { AuthContextType } from 'src/auth/dto/auth.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { CreateAiAgentDto, UpdateAiAgentDto } from './dto/ai.dto';
import { CreateAiToolDto, UpdateAiToolDto } from './dto/aiTool.dto';
import {
  CreateKnowledgeBaseDto,
  UpdateKnowledgeBaseDto,
} from './dto/knowledgeBase.dto';
import { CreateLLMDto, UpdateLLMDto } from './dto/llm.dto';
import { AiToolService } from './service/ai-tool.service';
import { AiAgentService } from './service/aiAgent.service';
import { KnowledgeBaseService } from './service/knowledge-base.service';
import { LlmService } from './service/llm.service';
import { SearchRequestDto } from 'src/common/request/request.dto';

@UseGuards(AuthGuard)
@Controller('ai')
export class AiController {
  constructor(
    @Inject() private readonly aiAgentService: AiAgentService,
    @Inject() private readonly aiToolService: AiToolService,
    @Inject() private readonly knowledgeBaseService: KnowledgeBaseService,
    @Inject() private readonly llmService: LlmService,
  ) {}

  // ================== Agent ====================

  @Post('/agent/create')
  async createAgent(
    @Body(ValidationPipe) data: CreateAiAgentDto,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.aiAgentService.createAgent(data, ctx);
  }

  @Post('/agent/list')
  async listAgent(
    @Body(ValidationPipe) request: SearchRequestDto,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.aiAgentService.list(request, ctx);
  }

  @Delete('/agent/:id')
  async deleteAgent(
    @Param('id') id: string,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.aiAgentService.deleteAgent(id, ctx);
  }

  @Get('/agent/:id')
  async getAgent(@Param('id') id: string) {
    return this.aiAgentService.findAgentById(id);
  }

  @Put('/agent/:id')
  async updateAgent(
    @Param('id') id: string,
    @Body(ValidationPipe) data: Partial<UpdateAiAgentDto>,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.aiAgentService.updateAgent(id, data, ctx);
  }

  // ================== LLM ====================

  @Post('/llm/create')
  async createLLM(
    @Body(ValidationPipe) data: CreateLLMDto,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.llmService.createLLM(data, ctx);
  }

  @Post('/llm/list')
  async listLLM(@Body(ValidationPipe) request: SearchRequestDto) {
    return this.llmService.list(request);
  }

  @Get('/llm/:id')
  async getLLM(@Param('id') id: string) {
    return this.llmService.findLLMById(id);
  }

  @Delete('/llm/:id')
  async deleteLLM(
    @Param('id') id: string,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.llmService.deleteLLM(id, ctx);
  }

  @Put('/llm/:id')
  async updateLLM(
    @Param('id') id: string,
    @Body(ValidationPipe) data: Partial<UpdateLLMDto>,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.llmService.updateLLM(id, data, ctx);
  }

  // ================== KnowledgeBase ====================

  @Post('/knowledge-base/create')
  async createKb(
    @Body(ValidationPipe) data: CreateKnowledgeBaseDto,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.knowledgeBaseService.createKnowledgeBase(data, ctx);
  }

  @Post('/knowledge-base/list')
  async listKb(
    @Body(ValidationPipe) request: SearchRequestDto,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.knowledgeBaseService.list(request, ctx);
  }

  @Get('/knowledge-base/:id')
  async getKb(@Param('id') id: string) {
    return this.knowledgeBaseService.findKnowledgeBaseById(id);
  }

  @Delete('/knowledge-base/:id')
  async deleteKb(@Param('id') id: string, @AuthContext() ctx: AuthContextType) {
    return this.knowledgeBaseService.deleteKnowledgeBase(id, ctx);
  }

  @Put('/knowledge-base/:id')
  async updateKb(
    @Param('id') id: string,
    @Body(ValidationPipe) data: Partial<UpdateKnowledgeBaseDto>,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.knowledgeBaseService.updateKnowledgeBase(id, data, ctx);
  }

  // ================== AiTool ====================

  @Post('/tool/create')
  async createAiTool(
    @Body(ValidationPipe) data: CreateAiToolDto,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.aiToolService.createAiTool(data, ctx);
  }

  @Post('/tool/list')
  async listTool(
    @Body(ValidationPipe) request: SearchRequestDto,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.aiToolService.list(request, ctx);
  }

  @Get('/tool/:id')
  async getAiTool(@Param('id') id: string) {
    return this.aiToolService.getAiTool(id);
  }

  @Delete('/tool/:id')
  async deleteAiTool(
    @Param('id') id: string,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.aiToolService.deleteAiTool(id, ctx);
  }

  @Put('/tool/:id')
  async updateAiTool(
    @Param('id') id: string,
    @Body(ValidationPipe) data: Partial<UpdateAiToolDto>,
    @AuthContext() ctx: AuthContextType,
  ) {
    return this.aiToolService.updateAiTool(id, data, ctx);
  }
}
