import { ServerPrimaryKeys } from "@gryffindor/client/common/constants/serverQueries/primaryKeys";
import { AiTool } from "@gryffindor/client/common/types/agent/tool.type";
import {
  ServerMutationParams,
  ServerQueryKey,
} from "@gryffindor/client/common/types/serverQueryKey.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { aiToolServiceServiceInstance } from "../../services/agent/aiToolService";

const createToolFn = async (mutationParams: { aiTool: Partial<AiTool> }) => {
  return aiToolServiceServiceInstance.create(mutationParams.aiTool);
};

export const useCreateAiToolMutation = (options?: ServerMutationParams) => {
  const { reactQueryOptions, onSuccess, onError } = options || {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createToolFn,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        predicate(query) {
          return (
            (query.queryKey?.[0] as ServerQueryKey)?.primaryKey ===
            ServerPrimaryKeys.AI_TOOL
          );
        },
      });
      onSuccess?.(data, variables, context);
    },
    onError,
    ...reactQueryOptions,
  });
};

const updateToolFn = async (mutationParams: { aiTool: Partial<AiTool> }) => {
  return aiToolServiceServiceInstance.update(
    mutationParams.aiTool._id!,
    mutationParams.aiTool,
  );
};

export const useUpdateAiToolMutation = (options?: ServerMutationParams) => {
  const { reactQueryOptions, onSuccess, onError } = options || {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateToolFn,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        predicate(query) {
          return (
            (query.queryKey?.[0] as ServerQueryKey)?.primaryKey ===
            ServerPrimaryKeys.AI_TOOL
          );
        },
      });
      onSuccess?.(data, variables, context);
    },
    onError,
    ...reactQueryOptions,
  });
};
