import { useMutation } from "@tanstack/react-query";
import { inferenceServiceInstance } from "../../services/agent/inferenceService";
import { ServerMutationParams } from "@gryffindor/client/common/types/serverQueryKey.type";

const generateTextFn = async (mutationParams: { text: string }) => {
  return await inferenceServiceInstance.generateText(mutationParams.text);
};

export const useGenerateTextMutation = (options?: ServerMutationParams) => {
  const { reactQueryOptions, onSuccess, onError } = options || {};

  return useMutation({
    mutationFn: generateTextFn,
    onSuccess,
    onError,
    ...reactQueryOptions,
  });
};
