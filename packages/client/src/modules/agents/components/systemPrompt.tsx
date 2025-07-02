import AppCard from "@gryffindor/client/common/components/app/appCard/appCard";
import GenerateTextWithAi from "@gryffindor/client/common/components/app/generateTextWithAi";
import { Textarea } from "@gryffindor/client/common/components/shadcn/components/ui/textarea";
import AddVariableDialog from "./addVariable/addVariableDialog";
import { getVariableText } from "./addVariable/util/addVariable.util";
import { Agent } from "@gryffindor/client/common/types/agent.type";
import { useCallback } from "react";

type Props = {
  agent?: Agent;
  onChange: (agent: Partial<Agent["configuration"]>) => void;
  addedVariables: string[];
};

export default function SystemPrompt({
  agent,
  onChange,
  addedVariables,
}: Props) {
  const onGenerateSystemPrompt = useCallback(
    (text: string) => {
      onChange({
        systemPrompt: text,
      });
    },
    [onChange],
  );

  return (
    <AppCard
      className="my-4"
      title="System Prompt"
      description={
        "The system prompt is used to determine the persona of the agent and the context of the conversation."
      }
      content={
        <div>
          <GenerateTextWithAi
            onGenerate={onGenerateSystemPrompt}
            inputClassName="!bg-background"
            className="mb-4"
            placeholder="Describe your agent (eg. You are a Mathemetics teacher, you ....)"
          />
          <Textarea
            className="!bg-background"
            placeholder="eg. You are a Mathemetics teacher, you ...."
            value={agent?.configuration?.systemPrompt}
            onChange={(e) =>
              onChange({
                systemPrompt: e.target.value,
              })
            }
          />
        </div>
      }
      footer={
        <AddVariableDialog
          addedVaribales={addedVariables}
          onAddVariable={(v) => {
            onChange({
              systemPrompt: `${agent?.configuration?.systemPrompt || ""} ${getVariableText({ label: v.label })}`,
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
