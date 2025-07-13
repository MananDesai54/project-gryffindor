import {
  Theme,
  ThemeContext,
} from "@gryffindor/client/common/api/decorators/hoc/themeProvider";
import { EMPTY_ARRAY_READ_ONLY } from "@gryffindor/client/common/constants/readOnly";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  Edge,
  MiniMap,
  Node,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useContext, useState } from "react";
import { SettingsPanel } from "./components/settingsPanel";
import {
  AiWorkflowComponentCategory,
  AiWorkflowComponentType,
  BaseWorkflowComponent,
} from "@gryffindor/client/common/types/ai-workflow/ai-workflow.type";

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

export default function AiWorkflowCreation() {
  const [nodes, setNodes] = useState<Node[]>(EMPTY_ARRAY_READ_ONLY);
  const [edges, setEdges] = useState<Edge[]>(EMPTY_ARRAY_READ_ONLY);
  const { theme } = useContext(ThemeContext);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect: OnConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  return (
    <div className="w-full h-full bg-secondary flex">
      <SettingsPanel workflowComponents={WorkflowComponents} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
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
