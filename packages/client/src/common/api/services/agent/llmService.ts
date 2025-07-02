import { LLM } from "@gryffindor/client/common/types/agent/llm.type";
import { CRUDService } from "../crudService";

class LLMService extends CRUDService<LLM> {
  private static instance: LLMService;

  private constructor() {
    super("ai/llm");
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new LLMService();
    }
    return this.instance;
  }
}

export const llmServiceInstance = LLMService.getInstance();
