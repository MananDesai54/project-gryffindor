import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthContextType } from 'src/auth/dto/auth.dto';
import { CRUDService } from 'src/core/rest/crud.controller';
import { SearchRequestDto } from 'src/core/rest/request/request.dto';
import { SearchResponse } from 'src/core/rest/request/request.type';
import { RequestUtil } from 'src/core/rest/request/request.util';
import { SearchService } from 'src/core/rest/search.controller';
import { CreateMCPServerDto } from './dto/mcp-server.dto';
import { MCPServer } from './schema/mcp-server.schema';

@Injectable()
export class McpServerService
  implements CRUDService<MCPServer>, SearchService<MCPServer>
{
  constructor(
    @InjectModel(MCPServer.name)
    private readonly mcpServerModel: Model<MCPServer>,
  ) {}

  async search(
    searchRequest: SearchRequestDto,
    ctx?: AuthContextType,
  ): Promise<SearchResponse<MCPServer>> {
    try {
      const { query, options } = RequestUtil.getMongoQueryAndOptionsForRequest(
        searchRequest,
        ctx,
      );

      const [mcpServer, count] = await Promise.all([
        this.mcpServerModel.find(query, null, options).exec(),
        this.mcpServerModel.countDocuments(query).exec(),
      ]);

      return {
        pageInfo: searchRequest.pageInfo,
        data: mcpServer,
        count: count,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async count(
    searchRequest: SearchRequestDto,
    ctx?: AuthContextType,
  ): Promise<number> {
    try {
      const { query } = RequestUtil.getMongoQueryAndOptionsForRequest(
        searchRequest,
        ctx,
      );
      return await this.mcpServerModel.countDocuments(query).exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  create(data: CreateMCPServerDto, ctx: AuthContextType): Promise<MCPServer> {
    try {
      return this.mcpServerModel.create({
        ...data,
        creator: ctx.userId,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async read(id: string): Promise<MCPServer> {
    try {
      const mcpServer = await this.mcpServerModel.findById(id);
      if (!mcpServer) {
        throw new NotFoundException('MCPServer not found');
      }
      return mcpServer;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async delete(id: string, ctx: AuthContextType): Promise<MCPServer> {
    try {
      const mcpServer = await this.mcpServerModel.findOneAndDelete({
        _id: id,
        creator: ctx.userId,
      });
      if (!mcpServer) {
        throw new NotFoundException(
          'You cannot delete mcpServer. Either it does not exist or you are not the creator.',
        );
      }

      return mcpServer;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(
    id: string,
    data: Partial<CreateMCPServerDto>,
    ctx: AuthContextType,
  ): Promise<MCPServer> {
    try {
      const mcpServer = await this.mcpServerModel.findOneAndUpdate(
        {
          _id: id,
          creator: ctx.userId,
        },
        data,
        { new: true, runValidators: true },
      );
      if (!mcpServer) {
        throw new NotFoundException(
          'You cannot update mcp server. Either it does not exist or you are not the creator.',
        );
      }
      return mcpServer;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
