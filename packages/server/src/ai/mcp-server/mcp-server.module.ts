import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { McpServerController } from './mcp-server.controller';
import { McpServerService } from './mcp-server.service';
import { MCPServer, MCPServerSchema } from './schema/mcp-server.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MCPServer.name,
        schema: MCPServerSchema,
      },
    ]),
  ],
  controllers: [McpServerController],
  providers: [McpServerService],
  exports: [McpServerService],
})
export class McpServerModule {}
