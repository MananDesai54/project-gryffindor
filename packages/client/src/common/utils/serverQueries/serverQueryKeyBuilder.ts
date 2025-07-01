import { ServerPrimaryKeys } from "../../constants/serverQueries/primaryKeys";
import { ServerQueryKey } from "../../types/serverQueryKey.type";

export function ServerQueryKeyBuilder<TOther = TSAny, TSecondary = string>(
  primaryKey?: ServerPrimaryKeys,
) {
  const queryKey: ServerQueryKey<TOther, TSecondary> = primaryKey
    ? { primaryKey }
    : ({} as ServerQueryKey<TOther, TSecondary>);

  return {
    primaryKey(key: ServerPrimaryKeys) {
      queryKey.primaryKey = key;
      return this;
    },

    secondaryKey(key: TSecondary) {
      queryKey.secondaryKey = key;
      return this;
    },

    otherParams(params: TOther) {
      queryKey.otherParams = params;
      return this;
    },

    build() {
      return queryKey;
    },
  };
}
