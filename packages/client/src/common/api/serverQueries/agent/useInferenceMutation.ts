import { useMutation } from "@tanstack/react-query";
import { inferenceServiceInstance } from "../../services/agent/inferenceService";
import { ServerMutationParams } from "@gryffindor/client/common/types/serverQueryKey.type";

const generateTextFn = async (mutationParams: {
  text: string;
  generateSystemPrompt?: boolean;
  systemPrompt?: string;
}) => {
  if (mutationParams.generateSystemPrompt) {
    return await inferenceServiceInstance.generateSystemPrompt(
      mutationParams.text,
    );
  } else if (mutationParams.systemPrompt) {
    return await inferenceServiceInstance.generateText(
      mutationParams.text,
      mutationParams.systemPrompt,
    );
  }
  throw new Error("System prompt is required");
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
