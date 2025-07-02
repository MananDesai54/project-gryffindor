import { apiRequest } from "../../common/request/axios";
import { ApiService } from "../apiService";

class InferenceService extends ApiService {
  private static instance: InferenceService;

  private constructor() {
    super("ai/inference");
  }

  generateText(text: string) {
    return apiRequest.post<{ text: string }, string>(
      this.createUrl("generate-text"),
      {
        text,
      },
    );
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new InferenceService();
    }
    return this.instance;
  }
}

export const inferenceServiceInstance = InferenceService.getInstance();
