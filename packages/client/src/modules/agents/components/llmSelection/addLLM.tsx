import { useCreateCustomLLMMutation } from "@gryffindor/client/common/api/serverQueries/agent/useLLMMutation";
import { Button } from "@gryffindor/client/common/components/shadcn/components/ui/button";
import { Input } from "@gryffindor/client/common/components/shadcn/components/ui/input";
import { Label } from "@gryffindor/client/common/components/shadcn/components/ui/label";
import { LLM } from "@gryffindor/client/common/types/agent/llm.type";
import { useCallback, useState } from "react";

type Props = {
  onCreateLLM: (llm: LLM) => void;
};

export default function AddLLM({ onCreateLLM }: Props) {
  const [serverUrl, setServerUrl] = useState("");
  const [modelId, setModelId] = useState("");
  const [apiKey, setApiKey] = useState("");

  const { mutateAsync, isPending } = useCreateCustomLLMMutation();

  const createLLM = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const llm = await mutateAsync({
        llm: {
          serverUrl,
          modelId,
          apiKey,
        },
      });
      onCreateLLM(llm);
    },
    [apiKey, modelId, mutateAsync, onCreateLLM, serverUrl],
  );

  return (
    <form className="p-6 bg-background rounded-2xl" onSubmit={createLLM}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="serverUrl">Server URL</Label>
          <Input
            id="serverUrl"
            type="url"
            placeholder="https://example.com"
            required
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
          />
          <div className="text-xs">
            The server is expected to match the OpenAI create chat completions
            API. We will send the requests to url/chat/completions endpoint on
            the server.
          </div>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="modelId">Model ID</Label>
          </div>
          <Input
            id="modelId"
            type="text"
            required
            onChange={(e) => setModelId(e.target.value)}
            value={modelId}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="apiKey">API Key</Label>
          </div>
          <Input
            id="apiKey"
            type="password"
            required
            onChange={(e) => setApiKey(e.target.value)}
            value={apiKey}
          />
        </div>
        <Button type="submit" className="w-full gap-2" disabled={isPending}>
          Create LLM
        </Button>
      </div>
    </form>
  );
}
