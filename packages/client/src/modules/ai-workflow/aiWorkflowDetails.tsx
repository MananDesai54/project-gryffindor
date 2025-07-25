import {
  Theme,
  ThemeContext,
} from "@gryffindor/client/common/api/decorators/hoc/themeProvider";
import { EMPTY_ARRAY_READ_ONLY } from "@gryffindor/client/common/constants/readOnly";
import {
  AiWorkflow,
  AiWorkflowNode,
  BaseWorkflowNode,
} from "@gryffindor/client/common/types/ai-workflow/ai-workflow.type";
import {
  addEdge,
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  OnConnect,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  Viewport,
  XYPosition,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  DragEventHandler,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  WorkflowNodes,
  WorkflowNodesByCategory,
} from "./components/constants/workflowDefaults";
import { SettingsPanel } from "./components/settingsPanel";
import WorkflowInputNode from "./components/workflowInputNode";
import { useParams } from "@tanstack/react-router";
import { Routes } from "@gryffindor/client/route/routes";
import { useAiWorkflowByIdQuery } from "@gryffindor/client/common/api/serverQueries/aiWorkflow/useAiWorkflowQuery";
import Loader from "@gryffindor/client/common/components/app/loader";
import { Button } from "@gryffindor/client/common/components/shadcn/components/ui/button";
import { useUpdateAiWorkflowMutation } from "@gryffindor/client/common/api/serverQueries/aiWorkflow/useAiWorkflowMutation";
import { NotifySuccess } from "@gryffindor/client/common/components/app/toast";

type Props = {
  workflow: AiWorkflow;
  onChangeWorkflow: (workflow: AiWorkflow) => void;
};

const NODE_TYPES: NodeTypes = {
  "workflow-node": WorkflowInputNode,
};

function WorkflowDetails(props: Props) {
  const [workflow, setWorkflow] = useState(props.workflow);

  const reactFlowRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(
    workflow.data?.nodes || EMPTY_ARRAY_READ_ONLY,
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    workflow.data?.edges || EMPTY_ARRAY_READ_ONLY,
  );
  const { screenToFlowPosition } = useReactFlow();

  const { theme } = useContext(ThemeContext);

  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot));
    },
    [setEdges],
  );

  const appendNode = useCallback(
    (position: XYPosition, node: BaseWorkflowNode) => {
      setNodes((nodes) => [
        ...nodes,
        {
          id: `${node.type}-${Date.now()}`,
          position,
          data: {
            ...node,
            id: `${node.type}-${Date.now()}`,
            node: WorkflowNodes[node.type]?.data?.node,
          },
          type: "workflow-node",
        } as AiWorkflowNode,
      ]);
    },
    [setNodes],
  );

  const onAddNode = useCallback(
    (node: BaseWorkflowNode) => {
      const position = screenToFlowPosition({
        x: reactFlowRef.current?.clientWidth
          ? reactFlowRef.current.clientWidth / 2
          : 0,
        y: reactFlowRef.current?.clientHeight
          ? reactFlowRef.current.clientHeight / 2
          : 0,
      });
      appendNode(position, node);
    },
    [screenToFlowPosition, appendNode],
  );

  const onDrop: DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();
      const nodeJson = event.dataTransfer.getData("application/reactflow");
      const node = JSON.parse(nodeJson) as BaseWorkflowNode;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      appendNode(position, node);
    },
    [screenToFlowPosition, appendNode],
  );

  const onDragOver: DragEventHandler<HTMLDivElement> = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.effectAllowed = "move";
  }, []);

  const onViewportChange = useCallback((viewport: Viewport) => {
    setWorkflow((workflow) => ({
      ...workflow,
      data: {
        ...workflow.data,
        viewport,
      },
    }));
  }, []);

  useEffect(() => {
    setWorkflow((workflow) => ({
      ...workflow,
      data: {
        ...workflow.data,
        edges,
        nodes,
      },
    }));
  }, [nodes, edges]);

  return (
    <div className="w-full h-full bg-secondary flex relative">
      <Button
        className="absolute right-2 top-2 z-10"
        onClick={() => {
          props.onChangeWorkflow(workflow);
        }}
      >
        Update
      </Button>
      <SettingsPanel
        workflowNodes={WorkflowNodesByCategory}
        onAddNode={onAddNode}
      />
      <ReactFlow
        viewport={workflow.data?.viewport}
        nodeTypes={NODE_TYPES}
        ref={reactFlowRef}
        nodes={nodes}
        edges={edges}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        colorMode={theme || Theme.dark}
        onViewportChange={onViewportChange}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export default function AiWorkflowDetails() {
  const params = useParams({
    from: Routes.AI_WORKFLOW_DETAIL,
  });

  const { data, isLoading } = useAiWorkflowByIdQuery({
    queryParams: {
      id: params.id,
    },
  });

  const { mutateAsync } = useUpdateAiWorkflowMutation();

  const updateWorkflow = useCallback(
    async (workflow: AiWorkflow) => {
      await mutateAsync({ aiWorkflow: workflow, aiWorkflowId: params.id });
      NotifySuccess("Workflow updated successfully");
    },
    [mutateAsync, params.id],
  );

  if (isLoading || !data) {
    return (
      <Loader className="w-screen h-screen flex justify-center items-center" />
    );
  }

  return (
    <ReactFlowProvider>
      <WorkflowDetails workflow={data} onChangeWorkflow={updateWorkflow} />
    </ReactFlowProvider>
  );
}
