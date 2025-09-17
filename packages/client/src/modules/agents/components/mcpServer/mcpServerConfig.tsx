import {
  FilterBuilder,
  SearchRequestBuilder,
} from '@gryffindor/client/common/api/common/request/requestBuilder';
import { useCreateMCPServerMutation } from '@gryffindor/client/common/api/serverQueries/agent/useMCPServerMutation';
import { useMCPServerQuery } from '@gryffindor/client/common/api/serverQueries/agent/useMCPServerQuery';
import AppCard from '@gryffindor/client/common/components/app/appCard/appCard';
import { Agent } from '@gryffindor/client/common/types/agent/agent.type';
import {
  McpServer,
  MCPServerApprovalPolicy,
} from '@gryffindor/client/common/types/agent/mcpServer.type';
import { reject } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import AddedMCPServer from './addedMCPServer';
import AddMCPServer from './addMCPServer/addMCPServer';

//  Types

interface Props {
  agent: Agent;
  onChange: (config: Partial<Agent['configuration']>) => void;
}

//  Global Constants & Functions

const McpServerConfig = (props: Props) => {
  //  Props Destructure
  const { agent, onChange } = props;

  //  State Variables
  const [newMCPServer, setNewMCPServer] = React.useState<McpServer>({
    transport: 'SSE',
    approvalPolicy: MCPServerApprovalPolicy.ALWAYS_ASK,
  } as McpServer);

  //  Queries and Mutations
  const { mutateAsync: createMCPServer } = useCreateMCPServerMutation();

  const request = useMemo(
    () =>
      new SearchRequestBuilder()
        .addFilter(
          new FilterBuilder()
            .field('_id')
            .value(agent?.configuration?.mcpServerIds || [])
            .build()
        )
        .build(),
    [agent?.configuration?.mcpServerIds]
  );
  const { data, isLoading } = useMCPServerQuery({
    queryParams: request,
    reactQueryOptions: {
      enabled: !!agent?.configuration?.mcpServerIds?.length,
    },
  });

  //  Constant, Refs and Memo Constant

  //  Helper Functions

  //  Handlers
  const onDeleteMCPServer = useCallback(
    (id: string) => {
      onChange({
        mcpServerIds: reject(
          agent.configuration?.mcpServerIds,
          (v) => v === id
        ),
      });
    },
    [agent.configuration?.mcpServerIds, onChange]
  );

  const onSaveMCPServer = useCallback(
    async (mcpServer: McpServer) => {
      if (!mcpServer) return;
      const mcp = await createMCPServer({
        mcp: mcpServer,
      });
      onChange({
        mcpServerIds: [...(agent?.configuration?.mcpServerIds || []), mcp._id],
      });
    },
    [agent?.configuration?.mcpServerIds, createMCPServer, onChange]
  );

  //  Effects

  return (
    <AppCard
      title="Custom MCP Servers"
      description="Provide the agent with Model Context Protocol servers to extend its capabilities."
      cardAction={
        <AddMCPServer
          onSaveMCPServer={onSaveMCPServer}
          setNewMCPServer={setNewMCPServer}
          mcpServer={newMCPServer}
        />
      }
      content={
        data?.data?.length && !isLoading ? (
          <AddedMCPServer
            mcpServers={data?.data}
            onDeleteMCPServer={onDeleteMCPServer}
          />
        ) : null
      }
    />
  );
};

export default React.memo(McpServerConfig);
