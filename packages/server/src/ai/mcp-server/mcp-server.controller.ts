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
import { AuthContextType } from 'src/auth/dto/auth.dto';
import { AuthContext } from 'src/core/decorators/authContext';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { CRUDController } from 'src/core/rest/crud.controller';
import { SearchRequestDto } from 'src/core/rest/request/request.dto';
import { SearchResponse } from 'src/core/rest/request/request.type';
import { SearchController } from 'src/core/rest/search.controller';
import { CreateMCPServerDto } from './dto/mcp-server.dto';
import { McpServerService } from './mcp-server.service';
import { MCPServer } from './schema/mcp-server.schema';

@Controller('ai/mcp-server')
@UseGuards(AuthGuard)
export class McpServerController
  implements CRUDController<MCPServer>, SearchController<MCPServer>
{
  constructor(@Inject() private readonly mcpServerService: McpServerService) {}

  @Post('/search')
  search(
    @Body(ValidationPipe) searchRequest: SearchRequestDto,
    @AuthContext()
    ctx?: AuthContextType,
  ): Promise<SearchResponse<MCPServer>> {
    return this.mcpServerService.search(searchRequest, ctx);
  }

  @Post('/count')
  count(
    @Body(ValidationPipe) searchRequest: SearchRequestDto,
    @AuthContext()
    ctx?: AuthContextType,
  ): Promise<number> {
    return this.mcpServerService.count(searchRequest, ctx);
  }

  @Post('/create')
  create(
    @Body(ValidationPipe) data: CreateMCPServerDto,
    @AuthContext() ctx: AuthContextType,
  ): Promise<MCPServer> {
    return this.mcpServerService.create(data, ctx);
  }

  @Get('/:id')
  read(@Param('id') id: string): Promise<MCPServer> {
    return this.mcpServerService.read(id);
  }

  @Delete('/:id')
  delete(
    @Param('id') id: string,
    @AuthContext() ctx: AuthContextType,
  ): Promise<MCPServer> {
    return this.mcpServerService.delete(id, ctx);
  }

  @Put('/:id')
  update(
    @Param('id')
    id: string,
    @Body(ValidationPipe) data: Partial<CreateMCPServerDto>,
    @AuthContext() ctx: AuthContextType,
  ): Promise<MCPServer> {
    return this.mcpServerService.update(id, data, ctx);
  }
}
