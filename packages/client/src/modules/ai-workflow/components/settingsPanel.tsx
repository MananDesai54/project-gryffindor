import { Button } from "@gryffindor/client/common/components/shadcn/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@gryffindor/client/common/components/shadcn/components/ui/collapsible";
import {
  AiWorkflowNodeCategory,
  BaseWorkflowNode,
} from "@gryffindor/client/common/types/ai-workflow/ai-workflow.type";
import { map } from "lodash";
import { ChevronRight, GripVertical, Plus } from "lucide-react";
import {
  WorkflowCategoryVsIcon,
  WorkflowNodeVsIcon,
} from "./constants/ai-workflow.constant";

type Props = {
  workflowNodes: Record<AiWorkflowNodeCategory, BaseWorkflowNode[]>;
  onAddNode: (node: BaseWorkflowNode) => void;
};

export function SettingsPanel(props: Props) {
  const { workflowNodes, onAddNode } = props;

  return (
    <aside className="w-[400px] bg-background">
      <div className="gap-0 p-2">
        {map(
          workflowNodes,
          (nodes: BaseWorkflowNode[], category: AiWorkflowNodeCategory) => {
            const Icon = WorkflowCategoryVsIcon[category];

            return (
              <Collapsible
                key={category}
                title={category}
                className="group/collapsible"
              >
                <div className="!py-0">
                  <CollapsibleTrigger className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm cursor-pointer flex items-center p-2 rounded-md w-full">
                    {Icon ? <Icon className="mr-2" size={16} /> : null}
                    <span>{category}</span>
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-2">
                      {map(nodes, (node: BaseWorkflowNode) => {
                        const Icon = WorkflowNodeVsIcon[node.type];
                        return (
                          <div
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData(
                                "application/reactflow",
                                JSON.stringify(node),
                              );
                              e.dataTransfer.effectAllowed = "move";
                            }}
                            key={node.type}
                            className="group cursor-pointer bg-secondary p-2 my-2 rounded-md hover:bg-neutral-900 transition-all flex justify-between items-center"
                          >
                            <div className="flex items-center">
                              {Icon ? (
                                <Icon className="mr-2" size={16} />
                              ) : null}
                              <div className="text-sm">{node.name}</div>
                            </div>
                            <div className="flex items-center">
                              <Button
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                variant="ghost"
                                size="icon"
                                onClick={() => onAddNode(node)}
                              >
                                <Plus size={16} />
                              </Button>
                              <GripVertical />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          },
        )}
      </div>
    </aside>
  );
}
