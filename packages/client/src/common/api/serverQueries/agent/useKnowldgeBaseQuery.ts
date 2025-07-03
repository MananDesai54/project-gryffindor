import { ServerPrimaryKeys } from "@gryffindor/client/common/constants/serverQueries/primaryKeys";
import { KnowledgeBase } from "@gryffindor/client/common/types/agent/knowledgeBase.type";
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
import { knowledgeBaseServiceInstance } from "../../services/agent/knowledgeBaseService";

type QueryParam = SearchRequest;

const kbListFn: FetchQueryFunctionType<QueryParam> = async (ctx) => {
  const { queryKey } = ctx;
  const { otherParams } = queryKey[0];

  return knowledgeBaseServiceInstance.list(otherParams || {});
};

export const useKnowledgeBaseQuery = (
  options: ServerQueryParams<QueryParam>,
) => {
  const { reactQueryOptions, queryParams } = options;
  const queryKey = ServerQueryKeyBuilder()
    .primaryKey(ServerPrimaryKeys.KNOWLEDGE_BASE)
    .otherParams(queryParams)
    .build();

  return useQuery<TSAny, Error, SearchResponse<KnowledgeBase>>({
    queryKey: [queryKey],
    queryFn: kbListFn as TSAny,
    ...reactQueryOptions,
  });
};
