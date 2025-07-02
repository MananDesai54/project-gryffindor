import { LLM } from "@gryffindor/client/common/types/agent/llm.type";
import {
  ServerMutationParams,
  ServerQueryKey,
} from "@gryffindor/client/common/types/serverQueryKey.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { llmServiceInstance } from "../../services/agent/llmService";
import { LLMType } from "@gryffindor/client/common/types/agent/ai.type";
import { ServerPrimaryKeys } from "@gryffindor/client/common/constants/serverQueries/primaryKeys";

const createCustomLLMFn = async (mutationParams: { llm: Partial<LLM> }) => {
  return llmServiceInstance.create({
    ...mutationParams.llm,
    type: LLMType.CUSTOM,
  });
};

export const useCreateCustomLLMMutation = (options?: ServerMutationParams) => {
  const { reactQueryOptions, onSuccess, onError } = options || {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomLLMFn,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        predicate(query) {
          return (
            (query.queryKey?.[0] as ServerQueryKey)?.primaryKey ===
            ServerPrimaryKeys.LLM_LIST
          );
        },
      });
      onSuccess?.(data, variables, context);
    },
    onError,
    ...reactQueryOptions,
  });
};
