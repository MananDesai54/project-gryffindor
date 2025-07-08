import {
  ServerMutationParams,
  ServerQueryKey,
} from "@gryffindor/client/common/types/serverQueryKey.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { agentInferenceServiceInstance } from "../../services/agent/agentInferenceService";
import { ServerPrimaryKeys } from "@gryffindor/client/common/constants/serverQueries/primaryKeys";

const agentInferenceFn = async (mutationParams: {
  chatId: string;
  message: string;
  runtimePromptVariables?: Record<string, string>;
  runTimeApiVariables?: Record<string, string>;
}) => {
  return agentInferenceServiceInstance.chat(
    mutationParams.chatId,
    mutationParams.message,
    mutationParams.runtimePromptVariables,
    mutationParams.runTimeApiVariables,
  );
};

export const useAgentInferenceMutation = (options?: ServerMutationParams) => {
  const { onSuccess, onError, reactQueryOptions } = options || {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: agentInferenceFn,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        predicate(query) {
          return (
            (query.queryKey?.[0] as ServerQueryKey)?.primaryKey ===
            ServerPrimaryKeys.AGENT_HISTORY
          );
        },
      });
      onSuccess?.(data, variables, context);
    },
    onError,
    ...reactQueryOptions,
  });
};
