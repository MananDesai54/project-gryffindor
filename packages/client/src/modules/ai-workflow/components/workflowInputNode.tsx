import AppCard from "@gryffindor/client/common/components/app/appCard/appCard";
import { AiWorkflowComponent } from "@gryffindor/client/common/types/ai-workflow/ai-workflow.type";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { memo } from "react";

function WorkflowInputNode(props: NodeProps<AiWorkflowComponent>) {
  const { data } = props;

  return (
    <div className="w-[400px]">
      <AppCard
        title={data.name}
        description={data.description}
        content={<div className="bg-background">Input</div>}
        footer={
          <div className="relative w-full">
            Output
            <Handle
              id={data.id}
              type="source"
              position={Position.Right}
              className="p-1 absolute !top-1"
            />
          </div>
        }
      />
    </div>
  );
}

export default memo(WorkflowInputNode);
