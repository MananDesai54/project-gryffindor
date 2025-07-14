import {
  Theme,
  ThemeContext,
} from "@gryffindor/client/common/api/decorators/hoc/themeProvider";
import { EMPTY_ARRAY_READ_ONLY } from "@gryffindor/client/common/constants/readOnly";
import {
  AiWorkflowComponentCategory,
  AiWorkflowComponentType,
  BaseWorkflowComponent,
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
import { SettingsPanel } from "./components/settingsPanel";
import WorkflowInputNode from "./components/workflowInputNode";

const WorkflowComponents: Record<
  AiWorkflowComponentCategory,
  BaseWorkflowComponent[]
> = {
  [AiWorkflowComponentCategory.IO]: [
    {
      category: AiWorkflowComponentCategory.IO,
      name: "Chat Input",
      type: AiWorkflowComponentType.ChatInput,
      id: "chat-input",
    },
    {
      category: AiWorkflowComponentCategory.IO,
      name: "Chat Output",
      type: AiWorkflowComponentType.ChatOutput,
      id: "chat-output",
    },
    {
      category: AiWorkflowComponentCategory.IO,
      name: "Text Input",
      type: AiWorkflowComponentType.TextInput,
      id: "text-input",
    },
    {
      category: AiWorkflowComponentCategory.IO,
      name: "Text Output",
      type: AiWorkflowComponentType.TextOutput,
      id: "text-output",
    },
  ],
  [AiWorkflowComponentCategory.Agent]: [],
  [AiWorkflowComponentCategory.LLM]: [],
  [AiWorkflowComponentCategory.Data]: [],
};

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
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [setEdges],
  );

  const appendNode = useCallback(
    (position: XYPosition, component: BaseWorkflowComponent) => {
      setNodes((nodes) => [
        ...nodes,
        {
          id: `${component.type}-${Date.now()}`,
          position,
          data: {
            ...component,
            id: `${component.type}-${Date.now()}`,
          },
          type: "workflow-node",
        },
      ]);
    },
    [setNodes],
  );

  const onAddComponent = useCallback(
    (component: BaseWorkflowComponent) => {
      const position = screenToFlowPosition({
        x: reactFlowRef.current?.clientWidth
          ? reactFlowRef.current.clientWidth / 2
          : 0,
        y: reactFlowRef.current?.clientHeight
          ? reactFlowRef.current.clientHeight / 2
          : 0,
      });
      appendNode(position, component);
    },
    [screenToFlowPosition, appendNode],
  );

  const onDrop: DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();
      const componentJson = event.dataTransfer.getData("application/reactflow");
      const component = JSON.parse(componentJson) as BaseWorkflowComponent;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      appendNode(position, component);
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
        workflowComponents={WorkflowComponents}
        onAddComponent={onAddComponent}
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
