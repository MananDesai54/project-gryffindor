import {
  FilterBuilder,
  SearchRequestBuilder,
} from "@gryffindor/client/common/api/common/request/requestBuilder";
import { useAiToolQuery } from "@gryffindor/client/common/api/serverQueries/agent/useAiToolQuery";
import { Button } from "@gryffindor/client/common/components/shadcn/components/ui/button";
import { Agent } from "@gryffindor/client/common/types/agent/agent.type";
import { AiToolType } from "@gryffindor/client/common/types/agent/ai.type";
import { AiTool } from "@gryffindor/client/common/types/agent/tool.type";
import { map, reject } from "lodash";
import { BrainCircuit, Trash, Webhook } from "lucide-react";
import { useMemo } from "react";

type Props = {
  agent: Agent;
  onChange(config: Agent["configuration"]): void;
  onOpenToolDetails(tool: AiTool): void;
};

const AiToolIcon = {
  [AiToolType.WEB_HOOK]: <Webhook size={18} />,
  [AiToolType.AGENT]: <BrainCircuit size={18} />,
};

export default function AddedTools(props: Props) {
  const { agent, onChange } = props;

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
  const { data, isLoading } = useAiToolQuery({
    queryParams: request,
    reactQueryOptions: {
      enabled: !!agent?.configuration?.customTools?.length,
    },
  });

  if (!data?.data?.length || isLoading) return null;

  return (
    <div className="bg-background p-4 rounded-xl border">
      {map(data.data, (tool) => {
        const Icon = AiToolIcon[tool.type];
        return (
          <div
            // onClick={() => {
            //   onOpenToolDetails(tool);
            // }}
            key={tool._id}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary cursor-pointer"
          >
            <div className="flex items-center">
              <div className="p-2 bg-accent rounded-lg">{Icon}</div>
              <span className="mx-2"> {tool.name}</span>
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                onChange({
                  customTools: reject(
                    agent.configuration?.customTools,
                    (v) => v === tool._id,
                  ),
                });
              }}
            >
              <Trash />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
