import { ServerPrimaryKeys } from '@gryffindor/client/common/constants/serverQueries/primaryKeys';
import { McpServer } from '@gryffindor/client/common/types/agent/mcpServer.type';
import {
  SearchRequest,
  SearchResponse,
} from '@gryffindor/client/common/types/request/searchRequest';
import {
  FetchQueryFunctionType,
  ServerQueryParams,
} from '@gryffindor/client/common/types/serverQueryKey.type';
import { ServerQueryKeyBuilder } from '@gryffindor/client/common/utils/serverQueries/serverQueryKeyBuilder';
import { useQuery } from '@tanstack/react-query';
import { mcpServerInstance } from '../../services/agent/mcpServerService';

type QueryParam = SearchRequest;

const kbListFn: FetchQueryFunctionType<QueryParam> = async (ctx) => {
  const { queryKey } = ctx;
  const { otherParams } = queryKey[0];

  return mcpServerInstance.search(otherParams || {});
};

export const useMCPServerQuery = (options: ServerQueryParams<QueryParam>) => {
  const { reactQueryOptions, queryParams } = options;
  const queryKey = ServerQueryKeyBuilder()
    .primaryKey(ServerPrimaryKeys.MCP_SERVER)
    .otherParams(queryParams)
    .build();

  return useQuery<TSAny, Error, SearchResponse<McpServer>>({
    queryKey: [queryKey],
    queryFn: kbListFn as TSAny,
    ...reactQueryOptions,
  });
};
