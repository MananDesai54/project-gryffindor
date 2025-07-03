import { useMutation } from "@tanstack/react-query";
import { fileServiceInstance } from "../../services/fileService";
import { ServerMutationParams } from "@gryffindor/client/common/types/serverQueryKey.type";

const uploadFileFn = async (mutationParam: { files: File[] }) => {
  const formData = new FormData();
  mutationParam.files.forEach((file) => {
    formData.append("files", file);
  });

  return fileServiceInstance.upload(formData);
};

export const useUploadFileMutation = (options?: ServerMutationParams) => {
  const { reactQueryOptions, onSuccess, onError } = options || {};

  return useMutation({
    mutationFn: uploadFileFn,
    onSuccess,
    onError,
    ...reactQueryOptions,
  });
};
