import { useAgentInferenceMutation } from "@gryffindor/client/common/api/serverQueries/agent/useAgentInferenceMutation";
import { useAgentHistoryQuery } from "@gryffindor/client/common/api/serverQueries/agent/useAgentInferenceQuery";
import { useAgentByIdQuery } from "@gryffindor/client/common/api/serverQueries/agent/useAgentQuery";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@gryffindor/client/common/components/app/chat/chat-bubble";
import { ChatInput } from "@gryffindor/client/common/components/app/chat/chat-input";
import { ChatMessageList } from "@gryffindor/client/common/components/app/chat/chat-message-list";
import { Button } from "@gryffindor/client/common/components/shadcn/components/ui/button";
import { HistoryMessageType } from "@gryffindor/client/common/types/agent/history.type";
import { Routes } from "@gryffindor/client/route/routes";
import { useParams } from "@tanstack/react-router";
import { map } from "lodash";
import { Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AgentInferenceScreen() {
  const params = useParams({
    from: Routes.AGENT_INFERENCE,
  });

  const [input, setInput] = useState<string>("");

  const messagesRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { data: agent, isLoading: loadingAgent } = useAgentByIdQuery({
    queryParams: {
      id: params.id,
    },
  });

  const { data: history, isLoading: loadingHistory } = useAgentHistoryQuery({
    queryParams: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      agentId: params.id,
    },
    reactQueryOptions: {
      enabled: !!agent,
    },
  });

  const { mutateAsync: doAgentInference, isPending: isGenerating } =
    useAgentInferenceMutation();

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [history]);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await doAgentInference({
        chatId: params.id,
        message: input,
      });
      setInput("");
    },
    [doAgentInference, input, params.id],
  );

  const onKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        await doAgentInference({
          chatId: params.id,
          message: input,
        });
        setInput("");
      }
    },
    [doAgentInference, input, params.id],
  );

  return (
    <>
      <div className="w-full flex justify-center max-h-[80vh]">
        <div className="!w-ful flex flex-col items-center">
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
