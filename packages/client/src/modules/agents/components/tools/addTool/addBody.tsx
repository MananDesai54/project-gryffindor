import AppCard from "@gryffindor/client/common/components/app/appCard/appCard";
import { Button } from "@gryffindor/client/common/components/shadcn/components/ui/button";
import { Textarea } from "@gryffindor/client/common/components/shadcn/components/ui/textarea";
import { WebhookBodySchema } from "@gryffindor/client/common/types/agent/tool.type";
import { map } from "lodash";
import AddParamForm from "./addParamForm";
import { Trash } from "lucide-react";
import { Label } from "@gryffindor/client/common/components/shadcn/components/ui/label";

type Props = {
  value?: WebhookBodySchema;
  onChange: (value: WebhookBodySchema) => void;
  updateDynamicVariable: (name: string) => void;
  allVariables?: string[];
};

export const AddBody = ({
  value,
  onChange,
  updateDynamicVariable,
  allVariables,
}: Props) => {
  return (
    <AppCard
      title="Body parameters"
      cardAction={
        <Button
          variant="outline"
          onClick={() => {
            onChange({
              ...value,
              payloadParams: [...(value?.payloadParams || []), {}],
            } as WebhookBodySchema);
          }}
        >
          Add
        </Button>
      }
      description="Define parameters that will be collected by the LLM and sent as the body of the request."
      content={
        <div className="grid gap-4">
          <Label>Description</Label>
          <Textarea
            placeholder="Enter description for body (This is needed as this will be passed to the LLM)"
            value={value?.description}
            onChange={(e) => {
              onChange({
                ...value,
                description: e.target.value,
              } as WebhookBodySchema);
            }}
          />
          {map(value?.payloadParams, (p, index) => (
            <div className="flex items-center" key={index}>
              <AddParamForm
                value={p}
                onSubmit={(v) => {
                  onChange({
                    ...value,
                    payloadParams: value?.payloadParams?.map((param, _index) =>
                      _index === index ? v : param,
                    ),
                  } as WebhookBodySchema);
                }}
                allVariables={allVariables}
                updateDynamicVariable={updateDynamicVariable}
              />
              <Button
                className="ml-2"
                variant="outline"
                size="icon"
                onClick={() => {
                  onChange({
                    ...value,
                    payloadParams: value?.payloadParams?.filter(
                      (_, _index) => _index !== index,
                    ),
                  } as WebhookBodySchema);
                }}
              >
                <Trash />
              </Button>
            </div>
          ))}
        </div>
      }
    />
  );
};
