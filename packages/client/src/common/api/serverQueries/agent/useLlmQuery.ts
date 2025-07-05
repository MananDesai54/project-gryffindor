import { ServerPrimaryKeys } from "@gryffindor/client/common/constants/serverQueries/primaryKeys";
import { LLM } from "@gryffindor/client/common/types/agent/llm.type";
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
import { llmServiceInstance } from "../../services/agent/llmService";

type QueryParam = SearchRequest;

const llmListFn: FetchQueryFunctionType<QueryParam> = async (ctx) => {
  const { queryKey } = ctx;
  const { otherParams } = queryKey[0];

  return llmServiceInstance.search(otherParams || {});
};

export const useLLMQuery = (options: ServerQueryParams<QueryParam>) => {
  const { reactQueryOptions, queryParams } = options;
  const queryKey = ServerQueryKeyBuilder()
    .primaryKey(ServerPrimaryKeys.LLM)
    .otherParams(queryParams)
    .build();

  return useQuery<TSAny, Error, SearchResponse<LLM>>({
    queryKey: [queryKey],
    queryFn: llmListFn as TSAny,
    ...reactQueryOptions,
  });
};
