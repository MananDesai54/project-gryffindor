import { ServerPrimaryKeys } from "@gryffindor/client/common/constants/serverQueries/primaryKeys";
import { AiWorkflow } from "@gryffindor/client/common/types/ai-workflow/ai-workflow.type";
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
import { aiWorkflowServiceInstance } from "../../services/aiWorkflow/aiWorkflowService";

type AiWorkflowQueryParam = {
  id: string;
};

const fetchAiWorkflowFn: FetchQueryFunctionType<undefined, string> = async (
  ctx,
) => {
  const { queryKey } = ctx;
  const { secondaryKey: id } = queryKey[0];

  if (!id) throw new Error("Ai Workflow id is required");

  return aiWorkflowServiceInstance.get(id);
};

export const useAiWorkflowByIdQuery = (
  options: ServerQueryParams<AiWorkflowQueryParam>,
) => {
  const { queryParams, reactQueryOptions } = options;
  const { id } = queryParams || {};

  const queryKey = ServerQueryKeyBuilder<undefined, string>(
    ServerPrimaryKeys.AI_WORKFLOW_DETAILS,
  )
    .secondaryKey(id || "")
    .build();

  return useQuery<TSAny, Error, AiWorkflow>({
    queryKey: [queryKey],
    queryFn: fetchAiWorkflowFn as TSAny,
    ...reactQueryOptions,
  });
};

const aiWorkflowListFn: FetchQueryFunctionType<SearchRequest> = async (ctx) => {
  const { queryKey } = ctx;
  const { otherParams } = queryKey[0];

  return aiWorkflowServiceInstance.search(otherParams || {});
};

export const useAiWorkflowQuery = (
  options: ServerQueryParams<SearchRequest>,
) => {
  const { reactQueryOptions, queryParams } = options;
  const queryKey = ServerQueryKeyBuilder()
    .primaryKey(ServerPrimaryKeys.AI_WORKFLOW)
    .otherParams(queryParams)
    .build();

  return useQuery<TSAny, Error, SearchResponse<AiWorkflow>>({
    queryKey: [queryKey],
    queryFn: aiWorkflowListFn as TSAny,
    ...reactQueryOptions,
  });
};
