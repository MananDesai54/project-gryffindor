import { AiTool } from "@gryffindor/client/common/types/agent/tool.type";
import { CRUDService } from "../crudService";

class AiToolService extends CRUDService<AiTool> {
  private static instance: AiToolService;

  private constructor() {
    super("ai/tool");
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new AiToolService();
    }
    return this.instance;
  }
}

export const aiToolServiceServiceInstance = AiToolService.getInstance();
