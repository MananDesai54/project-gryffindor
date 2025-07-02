import { ServerPrimaryKeys } from "@gryffindor/client/common/constants/serverQueries/primaryKeys";
import {
  FetchQueryFunctionType,
  ServerQueryParams,
} from "@gryffindor/client/common/types/serverQueryKey.type";
import { ServerQueryKeyBuilder } from "@gryffindor/client/common/utils/serverQueries/serverQueryKeyBuilder";
import { useQuery } from "@tanstack/react-query";
import { agentServiceInstance } from "../../services/agent/agentService";
import { Agent } from "@gryffindor/client/common/types/agent.type";

type AgentQueryParam = {
  id: string;
};

const fetchAgentFn: FetchQueryFunctionType<undefined, string> = async (ctx) => {
  const { queryKey } = ctx;
  const { secondaryKey: id } = queryKey[0];

  if (!id) throw new Error("Agent id is required");

  return agentServiceInstance.get(id);
};

export const useAgentQuery = (options: ServerQueryParams<AgentQueryParam>) => {
  const { queryParams, reactQueryOptions } = options;
  const { id } = queryParams || {};

  const queryKey = ServerQueryKeyBuilder<undefined, string>(
    ServerPrimaryKeys.AGENT_DETAILS,
  )
    .secondaryKey(id || "")
    .build();

  return useQuery<TSAny, Error, Agent>({
    queryKey: [queryKey],
    queryFn: fetchAgentFn as TSAny,
    ...reactQueryOptions,
  });
};
