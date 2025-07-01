import {
  QueryFunction,
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { ServerPrimaryKeys } from "../constants/serverQueries/primaryKeys";

export type ServerQueryKey<TOther = TSAny, TSecondary = TSAny> = {
  primaryKey: ServerPrimaryKeys;
  secondaryKey?: TSecondary;
  otherParams?: TOther;
};

export type ServerQueryParams<TParams = Record<string, TSAny>> = {
  queryParams?: TParams;
  queryKey?: ServerQueryKey;
  reactQueryOptions?: Omit<
    UseQueryOptions<TSAny, Error, TSAny, TSAny>,
    "initialData"
  > & {
    initialData?: () => undefined;
  };
};

export type ServerInfiniteQueryParams<TParams = Record<string, TSAny>> = {
  queryParams?: TParams;
  queryKey?: ServerQueryKey;
  reactQueryOptions?: Partial<UseInfiniteQueryOptions>;
};

export type ServerMutationParams<TParams = Record<string, TSAny>> = {
  mutationParams?: TParams;
  onSuccess?: (data: TSAny, variables?: TSAny, context?: TSAny) => void;
  onError?: (error: Error, variables?: TSAny, context?: TSAny) => void;
  onSettled?: (
    data: TSAny | undefined,
    error: Error | null,
    variables: TSAny,
    context: TSAny | undefined,
  ) => void;
  reactQueryOptions?: Partial<UseMutationOptions>;
};

export type FetchQueryFunctionType<
  TQueryParams = TSAny,
  TSecondary = TSAny,
  TData = TSAny,
> = QueryFunction<TData, readonly ServerQueryKey<TQueryParams, TSecondary>[]>;
