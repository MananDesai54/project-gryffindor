import { ServerPrimaryKeys } from "@gryffindor/client/common/constants/serverQueries/primaryKeys";
import { Agent } from "@gryffindor/client/common/types/agent/agent.type";
import {
  ServerMutationParams,
  ServerQueryKey,
} from "@gryffindor/client/common/types/serverQueryKey.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { agentServiceInstance } from "../../services/agent/agentService";

const createAgentFn = async (mutationParams: { agent: Partial<Agent> }) => {
  const agent = await agentServiceInstance.create(mutationParams.agent);
  return agent;
};

const updateAgentFn = async (mutationParams: {
  agentId: string;
  agent: Partial<Agent>;
}) => {
  const agent = await agentServiceInstance.update(
    mutationParams.agentId,
    mutationParams.agent,
  );
  return agent;
};

export const useCreateAgentMutation = (options?: ServerMutationParams) => {
  const { onSuccess, onError, reactQueryOptions } = options || {};

  return useMutation({
    mutationFn: createAgentFn,
    onSuccess(data, variables, context) {
      onSuccess?.(data, variables, context);
    },
    onError,
    ...reactQueryOptions,
  });
};

export const useUpdateAgentMutation = (options?: ServerMutationParams) => {
  const { onSuccess, onError, reactQueryOptions } = options || {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAgentFn,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        predicate(query) {
          return (
            (query.queryKey?.[0] as ServerQueryKey)?.primaryKey ===
            ServerPrimaryKeys.AGENT_DETAILS
          );
        },
      });
      onSuccess?.(data, variables, context);
    },
    onError,
    ...reactQueryOptions,
  });
};
