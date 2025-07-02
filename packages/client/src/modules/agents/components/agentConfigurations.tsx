import AppCard from "@gryffindor/client/common/components/app/appCard/appCard";
import GenerateTextWithAi from "@gryffindor/client/common/components/app/generateTextWithAi";
import { Input } from "@gryffindor/client/common/components/shadcn/components/ui/input";
import { Textarea } from "@gryffindor/client/common/components/shadcn/components/ui/textarea";
import { Agent } from "@gryffindor/client/common/types/agent.type";
import { keys, map, reduce } from "lodash";
import { useCallback, useEffect, useMemo } from "react";
import AddVariableDialog from "./addVariable/addVariableDialog";
import {
  extractVariables,
  getVariableText,
} from "./addVariable/util/addVariable.util";

type Props = {
  agent?: Agent;
  onChange: (agent: Partial<Agent["configuration"]>) => void;
};

export default function AgentConfigurations({ agent, onChange }: Props) {
  const addedVaribales = useMemo(
    () => keys(agent?.configuration?.dynamicVariables),
    [agent?.configuration?.dynamicVariables],
  );

  const onGenerateSystemPrompt = useCallback(
    (text: string) => {
      onChange({
        systemPrompt: text,
      });
    },
    [onChange],
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
            addedVaribales={addedVaribales}
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
              placeholder="Describe your agent (eg. You are a maths teacher, you ....)"
            />
            <Textarea
              className="!bg-background"
              placeholder="eg. You are a maths teacher, you ...."
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
            addedVaribales={addedVaribales}
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
      <AppCard
        title="Dynamic Variables"
        description="Variables like {{user_name}} in your prompts and first message will be replaced with actual values when the conversation starts"
        content={
          <>
            {map(addedVaribales, (v) => {
              return (
                <div key={v} className="flex justify-between my-2">
                  <div>{v}</div>
                  <Input
                    className="!bg-background w-4/5"
                    placeholder="Enter default value"
                    value={agent?.configuration?.dynamicVariables?.[v] || ""}
                    onChange={(e) =>
                      onChange({
                        dynamicVariables: {
                          ...agent?.configuration?.dynamicVariables,
                          [v]: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              );
            })}
          </>
        }
      />
      <AppCard
        title="LLM"
        description="Select which provider and model to use for the LLM."
      />
    </div>
  );
}
