import { ServerPrimaryKeys } from '@gryffindor/client/common/constants/serverQueries/primaryKeys';
import { McpServer } from '@gryffindor/client/common/types/agent/mcpServer.type';
import {
  ServerMutationParams,
  ServerQueryKey,
} from '@gryffindor/client/common/types/serverQueryKey.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mcpServerInstance } from '../../services/agent/mcpServerService';

const createMCPFn = async (mutationParams: { mcp: Partial<McpServer> }) => {
  return mcpServerInstance.create(mutationParams.mcp);
};

const updateMCPFn = async (mutationParams: { mcp: Partial<McpServer> }) => {
  return mcpServerInstance.update(mutationParams.mcp._id!, mutationParams.mcp);
};

export const useCreateMCPServerMutation = (options?: ServerMutationParams) => {
  const { reactQueryOptions, onSuccess, onError } = options || {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMCPFn,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        predicate(query) {
          return (
            (query.queryKey?.[0] as ServerQueryKey)?.primaryKey ===
            ServerPrimaryKeys.MCP_SERVER
          );
        },
      });
      onSuccess?.(data, variables, context);
    },
    onError,
    ...reactQueryOptions,
  });
};

export const useUpdateMCPServerMutation = (options?: ServerMutationParams) => {
  const { reactQueryOptions, onSuccess, onError } = options || {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMCPFn,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        predicate(query) {
          return (
            (query.queryKey?.[0] as ServerQueryKey)?.primaryKey ===
            ServerPrimaryKeys.MCP_SERVER
          );
        },
      });
      onSuccess?.(data, variables, context);
    },
    onError,
    ...reactQueryOptions,
  });
};
