import AppCard from "@gryffindor/client/common/components/app/appCard/appCard";
import AppDrawer from "@gryffindor/client/common/components/app/appDrawer/appDrawer";
import AppMenu from "@gryffindor/client/common/components/app/appMenu/appMenu";
import { ActionMenuItem } from "@gryffindor/client/common/components/app/appMenu/type";
import { Button } from "@gryffindor/client/common/components/shadcn/components/ui/button";
import { ToolTypeLabel } from "@gryffindor/client/common/constants/agent/tool.constant";
import {
  AiToolRequestMethod,
  AiToolType,
} from "@gryffindor/client/common/types/agent/ai.type";
import { AiTool } from "@gryffindor/client/common/types/agent/tool.type";
import { keys, map, reduce, uniq } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AddBody } from "./addBody";
import AddParameters from "./addParamerters";
import { AddQueryParam } from "./addQueryParam";
import AddToolBasicConfig from "./addToolBasicConfig";

type Props = {
  tool: AiTool;
  onAddTool: (tool: AiTool) => void;
  setNewTool: React.Dispatch<React.SetStateAction<AiTool>>;
};

export default function AddTool(props: Props) {
  const { onAddTool, tool: newTool, setNewTool } = props;

  const [activeToolType, setActiveToolType] = useState<AiToolType>();

  const actions = useMemo(
    () =>
      [
        {
          label: `Add ${ToolTypeLabel[AiToolType.WEB_HOOK]}`,
          onAction: () => setActiveToolType(AiToolType.WEB_HOOK),
        },
        // {
        //   label: `Add ${ToolTypeLabel[AiToolType.AGENT]}`,
        //   onAction: () => setActiveToolType(AiToolType.AGENT),
        // },
      ] as ActionMenuItem[],
    [],
  );

  const onSave = useCallback(() => {
    if (!newTool || !activeToolType) return;
    onAddTool({
      ...newTool,
      type: activeToolType,
    });
    setActiveToolType(undefined);
    setNewTool({
      reqTimeout: 20,
      apiSchema: { method: AiToolRequestMethod.GET },
    } as AiTool);
  }, [activeToolType, newTool, onAddTool, setNewTool]);

  const onChangeTool = useCallback(
    (toolUpdate: Partial<AiTool>) => {
      setNewTool(
        (tool) =>
          ({
            ...tool,
            ...toolUpdate,
          }) as AiTool,
      );
    },
    [setNewTool],
  );

  useEffect(() => {
    setActiveToolType(newTool.type);
  }, [newTool.type]);

  const allVariables = useMemo(() => {
    return keys(newTool.dynamicVariables);
  }, [newTool.dynamicVariables]);

  const updateDynamicVariable = useCallback(
    (v: string) =>
      onChangeTool({
        dynamicVariables: reduce(
          uniq([...allVariables, v].filter(Boolean)),
          (acc, key) => {
            acc[key] = newTool.dynamicVariables?.[key] ?? "";
            return acc;
          },
          {} as Record<string, string>,
        ),
      }),
    [allVariables, newTool.dynamicVariables, onChangeTool],
  );

  return (
    <>
      <AppMenu
        trigger={<Button variant="outline">Add Tool</Button>}
        actions={actions}
      />
      <AppDrawer
        title={`Add ${ToolTypeLabel[activeToolType!]} tool`}
        open={Boolean(activeToolType)}
        content={
          <div className="p-4 grid gap-4">
            <AddToolBasicConfig tool={newTool} onChange={onChangeTool} />
            <AddParameters
              allVariables={allVariables}
              pathParams={newTool.apiSchema?.pathParam}
              onChange={(v) =>
                onChangeTool({
                  apiSchema: {
                    ...newTool.apiSchema,
                    pathParam: v,
                  } as AiTool["apiSchema"],
                })
              }
              updateDynamicVariable={updateDynamicVariable}
            />
            <AddQueryParam
              allVariables={allVariables}
              value={newTool.apiSchema?.queryParams}
              onChange={(v) =>
                onChangeTool({
                  apiSchema: {
                    ...newTool.apiSchema,
                    queryParams: v,
                  } as AiTool["apiSchema"],
                })
              }
              updateDynamicVariable={updateDynamicVariable}
            />
            <AddBody
              allVariables={allVariables}
              updateDynamicVariable={updateDynamicVariable}
              value={newTool.apiSchema?.body}
              onChange={(v) =>
                onChangeTool({
                  apiSchema: {
                    ...newTool.apiSchema,
                    body: v,
                  } as AiTool["apiSchema"],
                })
              }
            />
            <AppCard
              title="Dynamic Variables"
              description="Variables in tool parameters will be replaced with actual values when the conversation starts"
              content={
                <div className="flex">
                  {map(newTool.dynamicVariables, (_, key) => (
                    <div key={key} className="p-2 rounded-full border">
                      {key}
                    </div>
                  ))}
                </div>
              }
            />
          </div>
        }
        onSave={onSave}
        onClose={() => {
          setActiveToolType(undefined);
          setNewTool({
            reqTimeout: 20,
            apiSchema: { method: AiToolRequestMethod.GET },
          } as AiTool);
        }}
      />
    </>
  );
}
