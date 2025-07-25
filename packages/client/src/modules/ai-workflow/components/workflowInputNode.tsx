import AppCard from "@gryffindor/client/common/components/app/appCard/appCard";
import { Button } from "@gryffindor/client/common/components/shadcn/components/ui/button";
import { AiWorkflowNode } from "@gryffindor/client/common/types/ai-workflow/ai-workflow.type";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { map, size } from "lodash";
import { Play } from "lucide-react";
import { memo } from "react";
import { WorkflowNodeVsIcon } from "./constants/ai-workflow.constant";

function WorkflowInputNode(props: NodeProps<AiWorkflowNode>) {
  const { data } = props;

  const Icon = WorkflowNodeVsIcon[data.type];

  return (
    <div className="min-w-[300px]">
      <AppCard
        title={
          <div className="flex items-center">
            {Icon ? <Icon className="mr-2" size={16} /> : null}
            <div className="text-sm">{data.name}</div>
          </div>
        }
        description={data.description}
        className="py-0 rounded-2xl gap-0"
        headerClassName="p-4"
        footerClassName="px-0"
        cardAction={
          <Button variant="ghost" size="icon">
            <Play size={16} />
          </Button>
        }
        content={
          size(data?.node?.inputFields)
            ? map(data?.node?.inputFields, (field) => (
                <div key={field.id} className="flex items-center relative">
                  <div className="text-sm">{field.name}</div>
                  <Handle
                    id={data.id}
                    type="target"
                    position={Position.Left}
                    className="p-1 absolute !top-50% !bg-indigo-300 !border-2 !border-indigo-600 hover:!border-white"
                  />
                </div>
              ))
            : undefined
        }
        footer={
          data.node?.outputs?.length ? (
            <div className="relative w-full bg-secondary p-4 rounded-b-2xl text-right">
              {data.node.outputs[0].name}
              <Handle
                id={data.node.outputs[0]?.id}
                type="source"
                position={Position.Right}
                className="p-1 absolute !top-50% !bg-indigo-300 !border-2 !border-indigo-600 hover:!border-white"
              />
            </div>
          ) : undefined
        }
      />
    </div>
  );
}

export default memo(WorkflowInputNode);
