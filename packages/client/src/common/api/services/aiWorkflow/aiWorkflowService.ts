import { AiWorkflow } from "@gryffindor/client/common/types/ai-workflow/ai-workflow.type";
import { CRUDService } from "../crudService";

class AiWorkflowService extends CRUDService<AiWorkflow> {
  private static instance: AiWorkflowService;

  private constructor() {
    super("ai-workflow");
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new AiWorkflowService();
    }
    return this.instance;
  }
}

export const aiWorkflowServiceInstance = AiWorkflowService.getInstance();
