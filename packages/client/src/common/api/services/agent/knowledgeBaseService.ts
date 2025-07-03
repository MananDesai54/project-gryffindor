import { KnowledgeBase } from "@gryffindor/client/common/types/agent/knowledgeBase.type";
import { CRUDService } from "../crudService";

class KnowledgeBaseService extends CRUDService<KnowledgeBase> {
  private static instance: KnowledgeBaseService;

  private constructor() {
    super("ai/knowledge-base");
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new KnowledgeBaseService();
    }
    return this.instance;
  }
}

export const knowledgeBaseServiceInstance = KnowledgeBaseService.getInstance();
