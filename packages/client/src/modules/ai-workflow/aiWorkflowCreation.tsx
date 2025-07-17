import {
  Theme,
  ThemeContext,
} from "@gryffindor/client/common/api/decorators/hoc/themeProvider";
import { EMPTY_ARRAY_READ_ONLY } from "@gryffindor/client/common/constants/readOnly";
import {
  AiWorkflowEdge,
  AiWorkflowNode,
  AiWorkflowNodeConnectionType,
  AiWorkflowNodeType,
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
  XYPosition,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { DragEventHandler, useCallback, useContext, useRef } from "react";
import {
  WorkflowNodesByCategory,
  WorkflowNodes,
} from "./components/constants/workflowDefaults";
import { SettingsPanel } from "./components/settingsPanel";
import WorkflowInputNode from "./components/workflowInputNode";
import { find } from "lodash";

const NODE_TYPES: NodeTypes = {
  "workflow-node": WorkflowInputNode,
};

function WorkflowCreation() {
  const reactFlowRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(EMPTY_ARRAY_READ_ONLY);
  const [edges, setEdges, onEdgesChange] = useEdgesState(EMPTY_ARRAY_READ_ONLY);
  const { screenToFlowPosition } = useReactFlow();

  const { theme } = useContext(ThemeContext);

  const onConnect: OnConnect = useCallback(
    (params) => {
      const sourceNode = find(nodes, { id: params.source }) as AiWorkflowNode;
      const targetNode = find(nodes, { id: params.target }) as AiWorkflowNode;

      setEdges((edgesSnapshot) => [
        ...edgesSnapshot,
        {
          id: `${params.source}-${params.target}`,
          source: params.source,
          target: params.target,
          sourceHandle: params.sourceHandle,
          targetHandle: params.targetHandle,
          type: "node-connection",
          data: {
            sourceHandle: {
              id: params.source,
              name: sourceNode?.data?.name,
              outputTypes: [AiWorkflowNodeConnectionType.Message],
              type: sourceNode?.data?.type,
            },
            targetHandle: {
              id: params.target,
              name: targetNode?.data?.name,
              inputTypes: [AiWorkflowNodeConnectionType.Message],
              type: targetNode?.data?.type,
            },
          },
        } as AiWorkflowEdge,
      ]);
    },
    [nodes, setEdges],
  );
  console.log(edges);

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

  return (
    <div className="w-full h-full bg-secondary flex">
      <SettingsPanel
        workflowNodes={WorkflowNodesByCategory}
        onAddNode={onAddNode}
      />
      <ReactFlow
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
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export default function AiWorkflowCreation() {
  return (
    <ReactFlowProvider>
      <WorkflowCreation />
    </ReactFlowProvider>
  );
}
