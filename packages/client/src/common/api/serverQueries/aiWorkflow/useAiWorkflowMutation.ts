import { ServerPrimaryKeys } from "@gryffindor/client/common/constants/serverQueries/primaryKeys";
import {
  ServerMutationParams,
  ServerQueryKey,
} from "@gryffindor/client/common/types/serverQueryKey.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AiWorkflow } from "../../../types/ai-workflow/ai-workflow.type";
import { aiWorkflowServiceInstance } from "../../services/aiWorkflow/aiWorkflowService";

const createAiWorkflowFn = async (mutationParams: {
  aiWorkflow: Partial<AiWorkflow>;
}) => {
  return aiWorkflowServiceInstance.create(mutationParams.aiWorkflow);
};

const updateAiWorkflowFn = async (mutationParams: {
  aiWorkflowId: string;
  aiWorkflow: Partial<AiWorkflow>;
}) => {
  return aiWorkflowServiceInstance.update(
    mutationParams.aiWorkflowId,
    mutationParams.aiWorkflow,
  );
};

export const useCreateAiWorkflowMutation = (options?: ServerMutationParams) => {
  const { onSuccess, onError, reactQueryOptions } = options || {};

  return useMutation({
    mutationFn: createAiWorkflowFn,
    onSuccess(data, variables, context) {
      onSuccess?.(data, variables, context);
    },
    onError,
    ...reactQueryOptions,
  });
};

export const useUpdateAiWorkflowMutation = (options?: ServerMutationParams) => {
  const { onSuccess, onError, reactQueryOptions } = options || {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAiWorkflowFn,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        predicate(query) {
          return (
            (query.queryKey?.[0] as ServerQueryKey)?.primaryKey ===
            ServerPrimaryKeys.AI_WORKFLOW_DETAILS
          );
        },
      });
      onSuccess?.(data, variables, context);
    },
    onError,
    ...reactQueryOptions,
  });
};
