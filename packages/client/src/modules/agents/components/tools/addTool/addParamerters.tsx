import AppCard from "@gryffindor/client/common/components/app/appCard/appCard";
import { ApiParamsValueSchema } from "@gryffindor/client/common/types/agent/tool.type";
import { map } from "lodash";
import AddParamForm from "./addParamForm";

type Props = {
  pathParams?: ApiParamsValueSchema[];
  onChange: (params: ApiParamsValueSchema[]) => void;
  updateDynamicVariable: (name: string) => void;
  allVariables?: string[];
};

export default function AddParameters({
  pathParams,
  onChange,
  updateDynamicVariable,
  allVariables,
}: Props) {
  return (
    <AppCard
      title="Path parameters"
      description="Add path {parameters} wrapped in curly braces to the URL to configure them here."
      content={map(pathParams, (p, index) => (
        <div key={p.name} className="my-2">
          <AddParamForm
            allVariables={allVariables}
            value={p}
            updateDynamicVariable={updateDynamicVariable}
            onSubmit={(v) => {
              onChange([
                ...(pathParams?.slice(0, index) || []),
                v,
                ...(pathParams?.slice(index + 1) || []),
              ]);
            }}
            disableNameChange
          />
        </div>
      ))}
    />
  );
}
