import { fileServiceInstance } from "@gryffindor/client/common/api/services/fileService";
import { FileInput } from "@gryffindor/client/common/components/app/fileInput";
import { Button } from "@gryffindor/client/common/components/shadcn/components/ui/button";
import { useState } from "react";

type Props = {
  onChange: (value: string) => void;
};

export default function AddFile(props: Props) {
  const { onChange } = props;

  // The parent component manages the state
  const [myFiles, setMyFiles] = useState<(File & { preview?: string })[]>([]);

  const handleFilesChange = (newFiles: (File & { preview?: string })[]) => {
    setMyFiles(newFiles);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    myFiles.forEach((file) => {
      formData.append("files", file);
    });

    fileServiceInstance.upload(formData);
  };

  return (
    <div>
      <div className="max-w-4xl p-4 mx-auto sm:p-6 lg:p-8">
        <div className="p-8 bg-background border rounded-xl shadow-md">
          <h1 className="mb-6 text-3xl font-bold text-center">
            Upload Your Agent's Knowledge Base
          </h1>
          <form onSubmit={handleSubmit}>
            <FileInput files={myFiles} onFilesChange={handleFilesChange} />
            <div className="mt-8 text-center">
              <Button type="submit" disabled={myFiles.length === 0}>
                Save Agent
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
