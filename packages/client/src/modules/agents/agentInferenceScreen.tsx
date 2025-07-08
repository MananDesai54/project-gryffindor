import {
  FilterBuilder,
  SearchRequestBuilder,
} from "@gryffindor/client/common/api/common/request/requestBuilder";
import { useAgentInferenceMutation } from "@gryffindor/client/common/api/serverQueries/agent/useAgentInferenceMutation";
import { useAgentHistoryQuery } from "@gryffindor/client/common/api/serverQueries/agent/useAgentInferenceQuery";
import { useAgentByIdQuery } from "@gryffindor/client/common/api/serverQueries/agent/useAgentQuery";
import { useAiToolQuery } from "@gryffindor/client/common/api/serverQueries/agent/useAiToolQuery";
import AppCard from "@gryffindor/client/common/components/app/appCard/appCard";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@gryffindor/client/common/components/app/chat/chat-bubble";
import { ChatInput } from "@gryffindor/client/common/components/app/chat/chat-input";
import { ChatMessageList } from "@gryffindor/client/common/components/app/chat/chat-message-list";
import FormInput from "@gryffindor/client/common/components/app/formInput";
import Loader from "@gryffindor/client/common/components/app/loader";
import { Button } from "@gryffindor/client/common/components/shadcn/components/ui/button";
import { Label } from "@gryffindor/client/common/components/shadcn/components/ui/label";
import { EMPTY_OBJECT_READ_ONLY } from "@gryffindor/client/common/constants/readOnly";
import { HistoryMessageType } from "@gryffindor/client/common/types/agent/history.type";
import { Routes } from "@gryffindor/client/route/routes";
import { useParams } from "@tanstack/react-router";
import { keys, map, reduce } from "lodash";
import { Send } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AgentInferenceScreen() {
  const params = useParams({
    from: Routes.AGENT_INFERENCE,
  });

  const [input, setInput] = useState<string>("");
  const [promptVariablesState, setPromptVariablesState] = useState<
    Record<string, string>
  >(EMPTY_OBJECT_READ_ONLY);
  const [apiVariablesState, setApiVariablesState] = useState<
    Record<string, string>
  >(EMPTY_OBJECT_READ_ONLY);

  const messagesRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { data: agent, isLoading: loadingAgent } = useAgentByIdQuery({
    queryParams: {
      id: params.id,
    },
  });

  const request = useMemo(
    () =>
      new SearchRequestBuilder()
        .addFilter(
          new FilterBuilder()
            .field("_id")
            .value(agent?.configuration?.customTools || [])
            .build(),
        )
        .build(),
    [agent?.configuration?.customTools],
  );
  const { data: tools, isLoading: loadingTools } = useAiToolQuery({
    queryParams: request,
    reactQueryOptions: {
      enabled: !!agent?.configuration?.customTools?.length,
    },
  });

  const { data: history, isLoading: loadingHistory } = useAgentHistoryQuery({
    queryParams: {
      agentId: params.id,
    },
    reactQueryOptions: {
      enabled: !!agent,
    },
  });

  const { mutateAsync: doAgentInference, isPending: isGenerating } =
    useAgentInferenceMutation();

  const { apiVariables, promptVariables } = useMemo(() => {
    return {
      promptVariables: keys(agent?.configuration?.dynamicVariables),
      apiVariables: keys(
        reduce(
          tools?.data,
          (acc, tool) => ({ ...acc, ...tool.dynamicVariables }),
          {} as Record<string, string>,
        ),
      ),
    };
  }, [agent?.configuration?.dynamicVariables, tools?.data]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [history]);

  const performAgentInference = useCallback(async () => {
    await doAgentInference({
      chatId: params.id,
      message: input,
      runTimeApiVariables: apiVariablesState,
      runtimePromptVariables: promptVariablesState,
    });
    setInput("");
  }, [
    apiVariablesState,
    doAgentInference,
    input,
    params.id,
    promptVariablesState,
  ]);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await performAgentInference();
    },
    [performAgentInference],
  );

  const onKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        await performAgentInference();
      }
    },
    [performAgentInference],
  );

  if (loadingAgent || loadingTools || loadingHistory) {
    return (
      <Loader className="w-screen h-screen flex justify-center items-center" />
    );
  }

  return (
    <>
      <div className="w-full flex justify-center max-h-[80vh] relative">
        <AppCard
          title="Runtime Variables"
          description="Variables that are available to the agent during inference."
          className="absolute top-0 left-10 w-[300px] z-10"
          content={
            <div>
              <Label className="my-4">Prompt Variables</Label>
              <div className="p-4 bg-background rounded-2xl">
                {map(promptVariables, (variable) => (
                  <div key={variable}>
                    {variable}
                    <FormInput
                      placeholder="Enter value"
                      value={promptVariablesState?.[variable]}
                      onChange={(e) =>
                        setPromptVariablesState({
                          ...promptVariablesState,
                          [variable]: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}
              </div>
              <Label className="my-4">API Variables</Label>
              <div className="p-4 bg-background rounded-2xl">
                {map(apiVariables, (variable) => (
                  <div key={variable}>
                    {variable}
                    <FormInput
                      placeholder="Enter value"
                      value={apiVariablesState?.[variable]}
                      onChange={(e) =>
                        setApiVariablesState({
                          ...apiVariablesState,
                          [variable]: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          }
        />
        <div className="!w-full flex flex-col items-center">
          <ChatMessageList ref={messagesRef} className="items-center">
            <div className="flex flex-col gap-6 w-1/2">
              {!history?.length && (
                <ChatBubble variant="received">
                  <ChatBubbleAvatar src="" fallback="🤖" />
                  <ChatBubbleMessage>
                    {agent?.configuration?.firstMessage ||
                      "Hello! I'm the AI assistant. How can I help you today?"}
                  </ChatBubbleMessage>
                </ChatBubble>
              )}
              {map(history, (message, index) => (
                <ChatBubble
                  key={index}
                  variant={
                    message.type == HistoryMessageType.Human
                      ? "sent"
                      : "received"
                  }
                >
                  <ChatBubbleAvatar
                    src=""
                    fallback={
                      message.type == HistoryMessageType.Human ? "👨🏽" : "🤖"
                    }
                  />
                  <ChatBubbleMessage
                    variant={
                      message.type == HistoryMessageType.Human
                        ? "sent"
                        : "received"
                    }
                  >
                    {message.data?.content
                      .split("```")
                      .map((part: string, index: number) => {
                        // if (index % 2 === 0) {
                        return (
                          <Markdown key={index} remarkPlugins={[remarkGfm]}>
                            {part}
                          </Markdown>
                        );
                        // } else {
                        //   return (
                        //     // <pre className=" pt-2" key={index}>
                        //     //   <CodeDisplayBlock code={part} lang="" />
                        //     // </pre>
                        //   );
                        // }
                      })}
                  </ChatBubbleMessage>
                </ChatBubble>
              ))}
              {isGenerating && (
                <ChatBubble variant="received">
                  <ChatBubbleAvatar src="" fallback="🤖" />
                  <ChatBubbleMessage isLoading />
                </ChatBubble>
              )}
            </div>
          </ChatMessageList>
        </div>
      </div>
      <form
        ref={formRef}
        className="flex fixed gap-2 bottom-4 left-[25%] right-[25%]"
        onSubmit={onSubmit}
      >
        <ChatInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          className="min-h-32 !bg-background"
          placeholder="Ask anything"
        />
        <Button
          className="absolute bottom-2 right-2"
          type="submit"
          size="icon"
          disabled={loadingAgent || loadingHistory || !input}
        >
          <Send className="size-4" />
        </Button>
      </form>
    </>
  );
}
