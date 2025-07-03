import AppCard from "@gryffindor/client/common/components/app/appCard/appCard";
import AddTool from "./addTool/addTool";
import { Agent } from "@gryffindor/client/common/types/agent/agent.type";
import { useCallback } from "react";
import { AiTool } from "@gryffindor/client/common/types/agent/tool.type";
import { useCreateAiToolMutation } from "@gryffindor/client/common/api/serverQueries/agent/useAiToolMutation";
import AddedTools from "./addedTools";

type Props = {
  agent: Agent;
  onChange: (config: Partial<Agent["configuration"]>) => void;
};

export default function Tools(props: Props) {
  const { agent, onChange } = props;

  const { mutateAsync } = useCreateAiToolMutation();

  const onAddTool = useCallback(
    async (newTool: AiTool) => {
      if (!newTool) return;
      const kb = await mutateAsync({
        aiTool: newTool,
      });
      onChange({
        customTools: [...(agent?.configuration?.customTools || []), kb._id],
      });
    },
    [agent?.configuration?.customTools, mutateAsync, onChange],
  );

  return (
    <AppCard
      title="Tools"
      description="Let the agent perform specific actions."
      cardAction={<AddTool onAddTool={onAddTool} />}
      content={<AddedTools agent={agent} onChange={onChange} />}
    />
  );
}
