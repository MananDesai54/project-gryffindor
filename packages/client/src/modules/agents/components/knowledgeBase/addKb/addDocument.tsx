import { useUploadFileMutation } from "@gryffindor/client/common/api/serverQueries/file/useFileMutation";
import { FileInput } from "@gryffindor/client/common/components/app/fileInput";
import { NotifySuccess } from "@gryffindor/client/common/components/app/toast";
import { Button } from "@gryffindor/client/common/components/shadcn/components/ui/button";
import { UploadedFile } from "@gryffindor/client/common/types/file.type";
import { useCallback, useState } from "react";

type Props = {
  onChange: (value: UploadedFile) => void;
};

export default function AddFile(props: Props) {
  const { onChange } = props;

  const [myFiles, setMyFiles] = useState<File[]>([]);

  const handleFilesChange = useCallback((newFiles: File[]) => {
    setMyFiles(newFiles);
  }, []);

  const { mutateAsync: uploadFiles, isPending } = useUploadFileMutation();

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const files = await uploadFiles({ files: myFiles });
      NotifySuccess("File uploaded successfully");
      onChange(files[0]);
    },
    [myFiles, onChange, uploadFiles],
  );

  return (
    <div>
      <div className="max-w-4xl p-4 mx-auto sm:p-6 lg:p-8">
        <div className="p-8 bg-background border rounded-xl shadow-md">
          <h1 className="mb-6 text-3xl font-bold text-center">
            Upload Your Agent's Knowledge Base
          </h1>
          <form onSubmit={handleSubmit}>
            <FileInput
              files={myFiles}
              onFilesChange={handleFilesChange}
              maxFiles={1}
            />
            <div className="mt-8 text-center">
              <Button
                type="submit"
                variant="outline"
                disabled={myFiles.length === 0 || isPending}
              >
                Upload knowledge base
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
