import { Agent } from "@gryffindor/client/common/types/agent.type";
import { keys, reduce } from "lodash";
import { useEffect, useMemo } from "react";
import AddedVariables from "./addVariable/addedVariables";
import { extractVariables } from "./addVariable/util/addVariable.util";
import FirstMessage from "./firstMessage";
import SystemPrompt from "./systemPrompt";
import LlmSelection from "./llmSelection";

type Props = {
  agent?: Agent;
  onChange: (agent: Partial<Agent["configuration"]>) => void;
};

export default function AgentConfigurations({ agent, onChange }: Props) {
  const addedVariables = useMemo(
    () => keys(agent?.configuration?.dynamicVariables),
    [agent?.configuration?.dynamicVariables],
  );

  useEffect(() => {
    const allVariables = [
      ...extractVariables(agent?.configuration?.firstMessage || ""),
      ...extractVariables(agent?.configuration?.systemPrompt || ""),
    ];
    allVariables?.length &&
      onChange({
        dynamicVariables: reduce(
          allVariables,
          (acc, variable) => {
            acc[variable.label] = "";
            return acc;
          },
          {} as Record<string, string>,
        ),
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    agent?.configuration?.firstMessage,
    agent?.configuration?.systemPrompt,
    // onChange,
  ]);

  return (
    <div className="w-full mb-32">
      <FirstMessage
        addedVariables={addedVariables}
        agent={agent}
        onChange={onChange}
      />
      <SystemPrompt
        addedVariables={addedVariables}
        agent={agent}
        onChange={onChange}
      />
      <AddedVariables
        addedVariables={addedVariables}
        agent={agent}
        onChange={onChange}
      />
      <LlmSelection onChange={onChange} agent={agent} />
    </div>
  );
}
