import AppCard from "@gryffindor/client/common/components/app/appCard/appCard";
import { Button } from "@gryffindor/client/common/components/shadcn/components/ui/button";
import { ApiParamsValueSchema } from "@gryffindor/client/common/types/agent/tool.type";
import { map } from "lodash";
import { Trash } from "lucide-react";
import AddParamForm from "./addParamForm";

type Props = {
  value?: ApiParamsValueSchema[];
  onChange: (value: ApiParamsValueSchema[]) => void;
  updateDynamicVariable: (name: string) => void;
  allVariables?: string[];
};

export const AddHeaders = ({
  value,
  onChange,
  updateDynamicVariable,
  allVariables,
}: Props) => {
  return (
    <AppCard
      title="Headers"
      cardAction={
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            onChange([...(value || []), {} as ApiParamsValueSchema]);
          }}
        >
          Add
        </Button>
      }
      description="Define headers that will be collected by the LLM and sent as the headers of the request."
      content={map(value, (p, index) => (
        <div className="flex items-center my-4" key={index}>
          <div className="flex-1">
            <AddParamForm
              value={p}
              onSubmit={(v) => {
                onChange([
                  ...(value || []).slice(0, index),
                  v,
                  ...(value || []).slice(index + 1),
                ]);
              }}
              allVariables={allVariables}
              updateDynamicVariable={updateDynamicVariable}
            />
          </div>
          <Button
            className="ml-2"
            variant="outline"
            size="icon"
            onClick={() => {
              onChange([
                ...(value || []).slice(0, index),
                ...(value || []).slice(index + 1),
              ]);
            }}
          >
            <Trash />
          </Button>
        </div>
      ))}
    />
  );
};
