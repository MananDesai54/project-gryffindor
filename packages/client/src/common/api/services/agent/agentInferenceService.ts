import { MessageHistory } from "@gryffindor/client/common/types/agent/history.type";
import { apiRequest } from "../../common/request/axios";
import { ApiService } from "../apiService";

class AgentInferenceService extends ApiService {
  private static instance: AgentInferenceService;

  private constructor() {
    super("ai/inference");
  }

  getHistory(agentId: string) {
    return apiRequest.get<MessageHistory[]>(
      this.createUrl(`history/${agentId}`),
    );
  }

  chat(
    chatId: string,
    message: string,
    runtimePromptVariables?: Record<string, string>,
    runTimeApiVariables?: Record<string, string>,
  ) {
    return apiRequest.post<
      {
        chatId: string;
        message: string;
        runtimePromptVariables?: Record<string, string>;
        runTimeApiVariables?: Record<string, string>;
      },
      { output: string }
    >(this.createUrl(`chat/${chatId}`), {
      chatId,
      message,
      runtimePromptVariables,
      runTimeApiVariables,
    });
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new AgentInferenceService();
    }
    return this.instance;
  }
}

export const agentInferenceServiceInstance =
  AgentInferenceService.getInstance();
