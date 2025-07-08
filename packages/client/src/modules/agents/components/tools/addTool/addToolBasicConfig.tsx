import AppCard from "@gryffindor/client/common/components/app/appCard/appCard";
import AppSelect from "@gryffindor/client/common/components/app/appSelect/appSelect";
import FormInput from "@gryffindor/client/common/components/app/formInput";
import { Label } from "@gryffindor/client/common/components/shadcn/components/ui/label";
import { Slider } from "@gryffindor/client/common/components/shadcn/components/ui/slider";
import { Textarea } from "@gryffindor/client/common/components/shadcn/components/ui/textarea";
import {
  AiToolParamDataType,
  AiToolParamValueType,
  AiToolRequestMethod,
} from "@gryffindor/client/common/types/agent/ai.type";
import { AiTool } from "@gryffindor/client/common/types/agent/tool.type";
import { IdLabel } from "@gryffindor/client/common/types/idLabel.type";

const METHOD_OPTIONS = [
  { id: AiToolRequestMethod.GET, label: "GET" },
  { id: AiToolRequestMethod.POST, label: "POST" },
  { id: AiToolRequestMethod.PUT, label: "PUT" },
  { id: AiToolRequestMethod.DELETE, label: "DELETE" },
] as IdLabel[];

type Props = {
  tool?: AiTool;
  onChange: (tool: Partial<AiTool>) => void;
};

export default function AddToolBasicConfig(props: Props) {
  const { tool, onChange } = props;

  return (
    <>
      <AppCard
        title="Configuration"
        description="Describe to the LLM how and when to use the tool."
        content={
          <form className="bg-background border rounded-2xl p-6">
            <FormInput
              required
              label="Name"
              id="name"
              name="name"
              value={tool?.name}
              placeholder="Enter tool name"
              onChange={(e) => onChange({ name: e.target.value })}
            />
            <div className="my-5">
              <Label htmlFor="description" className="my-2">
                Description
              </Label>
              <Textarea
                required
                id="description"
                name="description"
                value={tool?.description}
                placeholder="Enter tool description"
                className="resize-none"
                onChange={(e) => onChange({ description: e.target.value })}
              />
            </div>
            <div className="flex items-center w-full">
              <div>
                <Label htmlFor="method" className="mb-2">
                  Method
                </Label>
                <AppSelect
                  required
                  options={METHOD_OPTIONS}
                  onChange={(value) => {
                    onChange({
                      apiSchema: {
                        ...tool?.apiSchema,
                        method: value,
                      } as AiTool["apiSchema"],
                    });
                  }}
                  value={tool?.apiSchema?.method || AiToolRequestMethod.GET}
                />
              </div>
              <FormInput
                required
                label="URL"
                id="url"
                name="url"
                value={tool?.apiSchema?.url || ""}
                placeholder="Enter tool URL"
                className="flex-1 ml-2"
                onChange={(e) =>
                  onChange({
                    apiSchema: {
                      ...tool?.apiSchema,
                      url: e.target.value,
                      pathParam: e.target.value
                        .match(new RegExp(/\{([^}]*)\}/g))
                        ?.map((v) => ({
                          datatype: AiToolParamDataType.STRING,
                          name: v,
                          valueType: AiToolParamValueType.LLM_PROMPT,
                        })),
                    } as AiTool["apiSchema"],
                  })
                }
              />
            </div>
            <div className="mt-6">
              <Label htmlFor="timeout">
                Response timeout ({tool?.reqTimeout || 20} seconds)
              </Label>
              <span className="text-muted-foreground text-xs">
                How long to wait for the client tool to respond before timing
                out. Default is 20 seconds.
              </span>
              <Slider
                min={0}
                max={120}
                step={1}
                value={[tool?.reqTimeout || 20]}
                onValueChange={(value) => onChange({ reqTimeout: value[0] })}
                className="flex-1 my-4"
              />
            </div>
          </form>
        }
      />
    </>
  );
}
