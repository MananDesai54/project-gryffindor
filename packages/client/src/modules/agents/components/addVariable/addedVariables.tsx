import AppCard from "@gryffindor/client/common/components/app/appCard/appCard";
import { Input } from "@gryffindor/client/common/components/shadcn/components/ui/input";
import { Agent } from "@gryffindor/client/common/types/agent.type";
import { map } from "lodash";

type Props = {
  agent?: Agent;
  onChange: (agent: Partial<Agent["configuration"]>) => void;
  addedVariables?: string[];
};

export default function AddedVariables(props: Props) {
  const { addedVariables = [], agent, onChange } = props;

  return (
    <AppCard
      title="Dynamic Variables"
      description="Variables like {{user_name}} in your prompts and first message will be replaced with actual values when the conversation starts"
      content={
        <>
          {map(addedVariables, (v) => {
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
  );
}
