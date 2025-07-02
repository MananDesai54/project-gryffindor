import { ServerPrimaryKeys } from "@gryffindor/client/common/constants/serverQueries/primaryKeys";
import {
  FetchQueryFunctionType,
  ServerQueryParams,
} from "@gryffindor/client/common/types/serverQueryKey.type";
import { ServerQueryKeyBuilder } from "@gryffindor/client/common/utils/serverQueries/serverQueryKeyBuilder";
import { useQuery } from "@tanstack/react-query";
import { authServiceInstance } from "../../services/user/authService";
import { User } from "@gryffindor/client/common/types/user.type";
import { SLOW_STALE } from "@gryffindor/client/common/constants/serverQueries/queryTimes";

const allUserQueryFn: FetchQueryFunctionType = async () => {
  const response = await authServiceInstance.me();
  return response;
};

export const useMeQuery = (options?: ServerQueryParams) => {
  const { reactQueryOptions } = options || {};

  const queryKey = ServerQueryKeyBuilder(ServerPrimaryKeys.ME).build();

  return useQuery<TSAny, Error, User>({
    queryKey: [queryKey],
    queryFn: allUserQueryFn as TSAny,
    staleTime: SLOW_STALE,
    ...reactQueryOptions,
  });
};
