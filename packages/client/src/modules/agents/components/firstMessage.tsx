import AppCard from "@gryffindor/client/common/components/app/appCard/appCard";
import { Textarea } from "@gryffindor/client/common/components/shadcn/components/ui/textarea";
import AddVariableDialog from "./addVariable/addVariableDialog";
import { Agent } from "@gryffindor/client/common/types/agent/agent.type";
import { getVariableText } from "./addVariable/util/addVariable.util";

type Props = {
  agent?: Agent;
  onChange: (data: Partial<Agent["configuration"]>) => void;
  addedVariables?: string[];
};

export default function FirstMessage(props: Props) {
  const { agent, onChange, addedVariables } = props;

  return (
    <AppCard
      title="First message"
      description={
        "The first message the agent will say. If empty, the agent will wait for the user to start the conversation."
      }
      content={
        <Textarea
          className="!bg-background"
          value={
            agent?.configuration?.firstMessage ||
            "Hello! How can I help you today?"
          }
          onChange={(e) =>
            onChange({
              firstMessage: e.target.value,
            })
          }
        />
      }
      footer={
        <AddVariableDialog
          addedVaribales={addedVariables}
          onAddVariable={(v) => {
            onChange({
              firstMessage: `${agent?.configuration?.firstMessage || "Hello! How can I help you today?"} ${getVariableText({ label: v.label })}`,
              dynamicVariables: {
                ...agent?.configuration?.dynamicVariables,
                [v.label]:
                  agent?.configuration?.dynamicVariables?.[v.label] || "",
              },
            });
          }}
        />
      }
    />
  );
}
