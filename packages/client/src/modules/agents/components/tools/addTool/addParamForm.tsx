import AppMenu from "@gryffindor/client/common/components/app/appMenu/appMenu";
import { ActionMenuItem } from "@gryffindor/client/common/components/app/appMenu/type";
import AppSelect from "@gryffindor/client/common/components/app/appSelect/appSelect";
import FormInput from "@gryffindor/client/common/components/app/formInput";
import { Button } from "@gryffindor/client/common/components/shadcn/components/ui/button";
import { Label } from "@gryffindor/client/common/components/shadcn/components/ui/label";
import { Textarea } from "@gryffindor/client/common/components/shadcn/components/ui/textarea";
import {
  AiToolParamDataType,
  AiToolParamValueType,
} from "@gryffindor/client/common/types/agent/ai.type";
import { ApiParamsValueSchema } from "@gryffindor/client/common/types/agent/tool.type";
import { IdLabel } from "@gryffindor/client/common/types/idLabel.type";
import { map } from "lodash";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

type Props = {
  value?: ApiParamsValueSchema;
  disableNameChange?: boolean;
  onSubmit: (value: ApiParamsValueSchema) => void;
  allVariables?: string[];
  updateDynamicVariable: (name: string) => void;
};

const DATA_TYPE_OPTIONS = [
  { id: AiToolParamDataType.BOOLEAN, label: "Boolean" },
  { id: AiToolParamDataType.STRING, label: "String" },
  { id: AiToolParamDataType.NUMBER, label: "Number" },
] as IdLabel[];

const VALUE_TYPE_OPTIONS = [
  { id: AiToolParamValueType.CONSTANT, label: "Constant" },
  { id: AiToolParamValueType.DYNAMIC_VARIABLE, label: "Dynamic Variable" },
  { id: AiToolParamValueType.LLM_PROMPT, label: "LLM Prompt" },
] as IdLabel[];

export default function AddParamForm(props: Props) {
  const {
    value,
    onSubmit,
    disableNameChange,
    allVariables,
    updateDynamicVariable,
  } = props;

  const [variable, setVariable] = useState<string>(value?.value || "");

  const menuOptions = useMemo(() => {
    if (!allVariables) return [];
    return map(allVariables?.filter(Boolean), (variable) => ({
      label: variable,
      onAction: () => {
        onSubmit({
          ...value,
          value: variable,
        } as ApiParamsValueSchema);
        setVariable(variable);
      },
    })) as ActionMenuItem[];
  }, [allVariables, onSubmit, value]);

  return (
    <form className="bg-background border rounded-2xl p-6">
      <div className="flex items-center w-full">
        <div>
          <Label htmlFor="datatype" className="mb-2">
            Data type
          </Label>
          <AppSelect
            required
            options={DATA_TYPE_OPTIONS}
            onChange={(datatype) => {
              onSubmit({
                ...value,
                datatype: datatype,
              } as ApiParamsValueSchema);
            }}
            value={value?.datatype}
          />
        </div>
        <FormInput
          required
          disabled={disableNameChange}
          label="Identifier"
          id="identifier"
          name="identifier"
          value={value?.name || ""}
          placeholder="Enter identifier"
          className="flex-1 ml-2"
          onChange={(e) => {
            onSubmit({
              ...value,
              name: e.target.value,
            } as ApiParamsValueSchema);
          }}
        />
      </div>
      <div className="my-2">
        <Label htmlFor="datatype" className="mb-2">
          Value type
        </Label>
        <AppSelect
          required
          options={VALUE_TYPE_OPTIONS}
          onChange={(datatype) => {
            onSubmit({
              ...value,
              valueType: datatype,
              value: "",
            } as ApiParamsValueSchema);
            setVariable("");
          }}
          value={value?.valueType}
        />
      </div>
      {value?.valueType === AiToolParamValueType.LLM_PROMPT ? (
        <Textarea
          required
          id="value"
          name="value"
          value={value?.value || ""}
          placeholder="Enter Prompt"
          className="my-4"
          onChange={(e) => {
            onSubmit({
              ...value,
              value: e.target.value,
            } as ApiParamsValueSchema);
          }}
        />
      ) : value?.valueType ? (
        <div className="flex items-center">
          <FormInput
            required
            id="value"
            name="value"
            value={
              value?.valueType === AiToolParamValueType.CONSTANT
                ? value?.value
                : variable
            }
            placeholder={
              value?.valueType === AiToolParamValueType.CONSTANT
                ? "Enter value"
                : "New variable name and press +"
            }
            className="mr-4 flex-1"
            onChange={(e) => {
              if (value?.valueType === AiToolParamValueType.DYNAMIC_VARIABLE) {
                setVariable(e.target.value);
              } else {
                onSubmit({
                  ...value,
                  value: e.target.value,
                } as ApiParamsValueSchema);
              }
            }}
          />
          {value?.valueType === AiToolParamValueType.DYNAMIC_VARIABLE ? (
            <div className="flex items-center">
              <Button
                className="mr-2"
                type="button"
                onClick={() => {
                  if (variable)
                    onSubmit({
                      ...value,
                      value: variable,
                    } as ApiParamsValueSchema);
                  updateDynamicVariable(variable);
                }}
              >
                <Plus /> Add
              </Button>
              <AppMenu actions={menuOptions} />
            </div>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
