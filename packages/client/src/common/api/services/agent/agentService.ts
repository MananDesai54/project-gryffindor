import { Agent } from "@gryffindor/client/common/types/agent.type";
import { CRUDService } from "../crudService";

class AgentService extends CRUDService<Agent> {
  private static instance: AgentService;

  private constructor() {
    super("ai/agent");
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new AgentService();
    }
    return this.instance;
  }
}

export const agentServiceInstance = AgentService.getInstance();
