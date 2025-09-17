import { McpServer } from '@gryffindor/client/common/types/agent/mcpServer.type';
import { CRUDService } from '../crudService';

class MCPServer extends CRUDService<McpServer> {
  private static instance: MCPServer;

  private constructor() {
    super('ai/mcp-server');
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new MCPServer();
    }
    return this.instance;
  }
}

export const mcpServerInstance = MCPServer.getInstance();
