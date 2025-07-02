import { ServerMutationParams } from "@gryffindor/client/common/types/serverQueryKey.type";
import { useMutation } from "@tanstack/react-query";
import { authServiceInstance } from "../../services/user/authService";

const loginFn = async (mutationParams: { email: string; password: string }) => {
  const resp = await authServiceInstance.login(
    mutationParams.email,
    mutationParams.password,
  );
  return resp;
};

export const useLoginMutation = (options?: ServerMutationParams) => {
  const { onSuccess, onError, reactQueryOptions } = options || {};

  return useMutation({
    mutationFn: loginFn,
    onSuccess,
    onError,
    ...reactQueryOptions,
  });
};
