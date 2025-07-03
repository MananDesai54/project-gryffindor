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
import { useCallback, useMemo, useState } from "react";
import AddToolBasicConfig from "./addToolBasicConfig";

type Props = {
  onAddTool: (tool: AiTool) => void;
};

export default function AddTool(props: Props) {
  const { onAddTool } = props;

  const [newTool, setNewTool] = useState<AiTool>({
    reqTimeout: 20,
    apiSchema: { method: AiToolRequestMethod.GET },
  } as AiTool);
  const [activeToolType, setActiveToolType] = useState<AiToolType>();

  const actions = useMemo(
    () =>
      [
        {
          label: `Add ${ToolTypeLabel[AiToolType.WEB_HOOK]}`,
          onAction: () => setActiveToolType(AiToolType.WEB_HOOK),
        },
        {
          label: `Add ${ToolTypeLabel[AiToolType.AGENT]}`,
          onAction: () => setActiveToolType(AiToolType.AGENT),
        },
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
  }, [activeToolType, newTool, onAddTool]);

  const onChangeTool = useCallback((toolUpdate: Partial<AiTool>) => {
    setNewTool(
      (tool) =>
        ({
          ...tool,
          ...toolUpdate,
        }) as AiTool,
    );
  }, []);

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
          <div className="p-4">
            <AddToolBasicConfig tool={newTool} onChange={onChangeTool} />
          </div>
        }
        onSave={onSave}
        onClose={() => setActiveToolType(undefined)}
      />
    </>
  );
}
