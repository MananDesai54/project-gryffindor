import useBoolean from '@gryffindor/client/common/api/decorators/hooks/useBoolean';
import AppCard from '@gryffindor/client/common/components/app/appCard/appCard';
import AppDrawer from '@gryffindor/client/common/components/app/appDrawer/appDrawer';
import FormInput from '@gryffindor/client/common/components/app/formInput';
import { NotifyError } from '@gryffindor/client/common/components/app/toast';
import { Button } from '@gryffindor/client/common/components/shadcn/components/ui/button';
import {
  McpServer,
  MCPServerApprovalPolicy,
} from '@gryffindor/client/common/types/agent/mcpServer.type';
import React, { useCallback } from 'react';
import AddMCPBasicInfo from './addMCPBasicInfo';
import AddMCPHeaders from './addMCPHeaders';
import ToolApprovalPolicy from './toolApprovalPolicy';

//  Types

interface Props {
  mcpServer: McpServer;
  onSaveMCPServer: (mcpServer: McpServer) => void;
  setNewMCPServer: React.Dispatch<React.SetStateAction<McpServer>>;
}

//  Global Constants & Functions

const AddMCPServer = (props: Props) => {
  //  Props Destructure
  const { mcpServer, onSaveMCPServer, setNewMCPServer } = props;

  //  State Variables
  const { toggle: toggleAddMCP, value: addMCP } = useBoolean();

  //  Queries and Mutations

  //  Constant, Refs and Memo Constant

  //  Helper Functions

  //  Handlers
  const onSave = useCallback(() => {
    if (!mcpServer) return;
    if (!mcpServer.name || !mcpServer.description) {
      NotifyError('MCP Server Name and description are required');
      return;
    }
    onSaveMCPServer(mcpServer);
    setNewMCPServer({
      transport: 'SSE',
      approvalPolicy: MCPServerApprovalPolicy.ALWAYS_ASK,
    } as McpServer);
    toggleAddMCP();
  }, [mcpServer, onSaveMCPServer, setNewMCPServer, toggleAddMCP]);

  //  Effects

  return (
    <>
      <Button variant="outline" onClick={toggleAddMCP}>
        Add MCP Server
      </Button>
      <AppDrawer
        title="New Custom MCP Server"
        open={Boolean(addMCP)}
        content={
          <div className="p-4 grid gap-3">
            <AddMCPBasicInfo mcpServer={mcpServer} onChange={setNewMCPServer} />
            <AppCard
              title="Server Configuration"
              description="Specify how to connect to your MCP server."
              content={
                <div>
                  <Button className="pointer-events-none mb-3">
                    Server Type: SSE
                  </Button>
                  <form className="bg-background border rounded-2xl p-6">
                    <FormInput
                      required
                      label="URL"
                      id="url"
                      name="url"
                      value={mcpServer.url}
                      placeholder="Enter server url"
                      onChange={(e) => {
                        setNewMCPServer({
                          ...mcpServer,
                          url: e.target.value,
                        } as McpServer);
                      }}
                    />
                  </form>
                </div>
              }
            />
            <AddMCPHeaders mcpServer={mcpServer} onChange={setNewMCPServer} />
            <ToolApprovalPolicy
              policy={mcpServer.approvalPolicy}
              onChange={(policy) =>
                setNewMCPServer({
                  ...mcpServer,
                  approvalPolicy: policy,
                } as McpServer)
              }
            />
          </div>
        }
        onSave={onSave}
        onClose={toggleAddMCP}
      />
    </>
  );
};

export default React.memo(AddMCPServer);
