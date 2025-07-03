import { ServerPrimaryKeys } from "@gryffindor/client/common/constants/serverQueries/primaryKeys";
import { KnowledgeBase } from "@gryffindor/client/common/types/agent/knowledgeBase.type";
import {
  ServerMutationParams,
  ServerQueryKey,
} from "@gryffindor/client/common/types/serverQueryKey.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { knowledgeBaseServiceInstance } from "../../services/agent/knowledgeBaseService";

const createKbFn = async (mutationParams: { kb: Partial<KnowledgeBase> }) => {
  return knowledgeBaseServiceInstance.create(mutationParams.kb);
};

export const useCreateKnowledgeBaseMutation = (
  options?: ServerMutationParams,
) => {
  const { reactQueryOptions, onSuccess, onError } = options || {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createKbFn,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        predicate(query) {
          return (
            (query.queryKey?.[0] as ServerQueryKey)?.primaryKey ===
            ServerPrimaryKeys.KNOWLEDGE_BASE
          );
        },
      });
      onSuccess?.(data, variables, context);
    },
    onError,
    ...reactQueryOptions,
  });
};
