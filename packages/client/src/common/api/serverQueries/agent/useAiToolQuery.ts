import { ServerPrimaryKeys } from "@gryffindor/client/common/constants/serverQueries/primaryKeys";
import { AiTool } from "@gryffindor/client/common/types/agent/tool.type";
import {
  SearchRequest,
  SearchResponse,
} from "@gryffindor/client/common/types/request/searchRequest";
import {
  FetchQueryFunctionType,
  ServerQueryParams,
} from "@gryffindor/client/common/types/serverQueryKey.type";
import { ServerQueryKeyBuilder } from "@gryffindor/client/common/utils/serverQueries/serverQueryKeyBuilder";
import { useQuery } from "@tanstack/react-query";
import { aiToolServiceServiceInstance } from "../../services/agent/aiToolService";

type QueryParam = SearchRequest;

const kbListFn: FetchQueryFunctionType<QueryParam> = async (ctx) => {
  const { queryKey } = ctx;
  const { otherParams } = queryKey[0];

  return aiToolServiceServiceInstance.list(otherParams || {});
};

export const useAiToolQuery = (options: ServerQueryParams<QueryParam>) => {
  const { reactQueryOptions, queryParams } = options;
  const queryKey = ServerQueryKeyBuilder()
    .primaryKey(ServerPrimaryKeys.AI_TOOL)
    .otherParams(queryParams)
    .build();

  return useQuery<TSAny, Error, SearchResponse<AiTool>>({
    queryKey: [queryKey],
    queryFn: kbListFn as TSAny,
    ...reactQueryOptions,
  });
};
