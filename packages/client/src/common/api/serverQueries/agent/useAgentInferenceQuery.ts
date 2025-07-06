import {
  FetchQueryFunctionType,
  ServerQueryParams,
} from "@gryffindor/client/common/types/serverQueryKey.type";
import { useQuery } from "@tanstack/react-query";
import { agentInferenceServiceInstance } from "../../services/agent/agentInferenceService";
import { ServerQueryKeyBuilder } from "@gryffindor/client/common/utils/serverQueries/serverQueryKeyBuilder";
import { ServerPrimaryKeys } from "@gryffindor/client/common/constants/serverQueries/primaryKeys";
import { MessageHistory } from "@gryffindor/client/common/types/agent/history.type";

const agentHistoryQuery: FetchQueryFunctionType<undefined, string> = async (
  ctx,
) => {
  const { queryKey } = ctx;
  const { secondaryKey: agentId } = queryKey[0];

  if (!agentId) throw new Error("Agent ID is required");

  return agentInferenceServiceInstance.getHistory(agentId);
};

export const useAgentHistoryQuery = (
  options: ServerQueryParams<{ agentId: string }>,
) => {
  const { reactQueryOptions, queryParams } = options;

  const queryKey = ServerQueryKeyBuilder()
    .primaryKey(ServerPrimaryKeys.AGENT_HISTORY)
    .secondaryKey(queryParams?.agentId || "")
    .build();

  return useQuery<any, Error, MessageHistory[]>({
    queryKey: [queryKey],
    queryFn: agentHistoryQuery as any,
    ...reactQueryOptions,
  });
};
