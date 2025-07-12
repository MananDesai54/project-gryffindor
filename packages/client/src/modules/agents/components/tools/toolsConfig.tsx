import {
  useCreateAiToolMutation,
  useUpdateAiToolMutation,
} from "@gryffindor/client/common/api/serverQueries/agent/useAiToolMutation";
import AppCard from "@gryffindor/client/common/components/app/appCard/appCard";
import { Agent } from "@gryffindor/client/common/types/agent/agent.type";
import { AiToolRequestMethod } from "@gryffindor/client/common/types/agent/ai.type";
import { AiTool } from "@gryffindor/client/common/types/agent/tool.type";
import { useCallback, useState } from "react";
import AddedTools from "./addedTools";
import AddTool from "./addTool/addTool";

type Props = {
  agent: Agent;
  onChange: (config: Partial<Agent["configuration"]>) => void;
};

export default function Tools(props: Props) {
  const { agent, onChange } = props;

  const [newTool, setNewTool] = useState<AiTool>({
    reqTimeout: 20,
    apiSchema: { method: AiToolRequestMethod.GET },
  } as AiTool);

  const { mutateAsync: createTool } = useCreateAiToolMutation();
  const { mutateAsync: updateTool } = useUpdateAiToolMutation();

  const onAddTool = useCallback(
    async (newTool: AiTool) => {
      if (!newTool) return;
      if (!newTool._id) {
        const kb = await createTool({
          aiTool: newTool,
        });
        onChange({
          customTools: [...(agent?.configuration?.customTools || []), kb._id],
        });
      } else {
        await updateTool({
          aiTool: newTool,
        });
      }
    },
    [agent?.configuration?.customTools, createTool, onChange, updateTool],
  );

  return (
    <AppCard
      title="Tools"
      description="Let the agent perform specific actions."
      cardAction={
        <AddTool onAddTool={onAddTool} tool={newTool} setNewTool={setNewTool} />
      }
      content={
        <AddedTools
          agent={agent}
          onChange={onChange}
          onOpenToolDetails={setNewTool}
        />
      }
    />
  );
}
