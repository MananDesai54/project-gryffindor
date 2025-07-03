import { useCallback, useState } from "react";
import { useDropzone, FileRejection, Accept } from "react-dropzone";
import { UploadCloud, File as FileIcon, X } from "lucide-react";

interface FileInputProps {
  files: (File & { preview?: string })[];
  onFilesChange: (files: (File & { preview?: string })[]) => void;
  maxFiles?: number;
  accept?: Accept;
  maxSize?: number;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export function FileInput({
  files,
  onFilesChange,
  maxFiles = 5,
  accept = {
    "application/pdf": [".pdf"],
    "text/html": [".html", ".htm"],
    "text/plain": [".txt"],
    // "image/*": [".jpeg", ".png", ".gif", ".webp"],
    // "video/*": [".mp4", ".webm", ".ogg"],
    // "audio/*": [".mp3", ".wav", ".ogg"],
    // "application/msword": [".doc", ".docx"],
    // "application/vnd.ms-powerpoint": [".ppt", ".pptx"],
    // "application/vnd.ms-excel": [".xls", ".xlsx"],
  },
  maxSize = 20 * 1024 * 1024, // 20MB
}: FileInputProps) {
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        setRejectedFiles(fileRejections);
      } else {
        setRejectedFiles([]);
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );

      onFilesChange([...files, ...newFiles].slice(0, maxFiles));
    },
    [files, onFilesChange, maxFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
  });

  const removeFile = (indexToRemove: number) => {
    const fileToRemove = files[indexToRemove];
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    onFilesChange(updatedFiles);
  };

  useState(() => () => {
    files.forEach((file) => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          w-full p-8 border-2 border-dashed rounded-xl text-center cursor-pointer
          transition-colors duration-300 ease-in-out
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400"
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4">
          <UploadCloud
            className={`w-12 h-12 ${isDragActive ? "text-blue-600" : "text-gray-400"}`}
          />
          {isDragActive ? (
            <p className="text-lg font-semibold text-blue-600">
              Drop the files here...
            </p>
          ) : (
            <div>
              <p className="text-lg font-semibold text-gray-700">
                Drag & drop files here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Supports: {Object.values(accept).flat().join(", ")} (Max{" "}
                {maxFiles} files, {formatBytes(maxSize)} each)
              </p>
            </div>
          )}
        </div>
      </div>

      {rejectedFiles.length > 0 && (
        <div className="p-3 mt-4 text-sm text-red-800 bg-red-100 border border-red-200 rounded-lg">
          <p className="font-semibold">Some files were rejected:</p>
          <ul className="pl-5 mt-1 list-disc">
            {rejectedFiles.map(({ file, errors }) => (
              <li key={file.name}>
                {file.name} ({formatBytes(file.size)}):{" "}
                {errors.map((e) => e.message).join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Uploaded Files:</h3>
          <ul className="grid gap-4">
            {files.map((file, index) => (
              <li
                key={index}
                className="relative flex items-center space-x-3 bg-secondary border rounded-lg shadow-sm"
              >
                {file.type.startsWith("image/") ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="object-cover w-16 h-16 rounded-md"
                    onLoad={() => {
                      URL.revokeObjectURL(file.preview!);
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-16 h-16 rounded-md">
                    <FileIcon className="w-8 h-8 " />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs ">{formatBytes(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute p-1  transition-colors bg-background rounded-full -top-2 -right-2 hover:bg-red-100 hover:text-red-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
