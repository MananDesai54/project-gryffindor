import AppCard from '@gryffindor/client/common/components/app/appCard/appCard';
import FormInput from '@gryffindor/client/common/components/app/formInput';
import { McpServer } from '@gryffindor/client/common/types/agent/mcpServer.type';
import React from 'react';

//  Types

type Props = {
  mcpServer: Partial<McpServer>;
  onChange: (mcpServer: McpServer) => void;
};

//  Global Constants & Functions

const AddMCPBasicInfo = (props: Props) => {
  //  Props Destructure
  const { mcpServer: value, onChange: onSubmit } = props;

  //  State Variables

  //  Queries and Mutations

  //  Constant, Refs and Memo Constant

  //  Helper Functions

  //  Handlers

  //  Effects

  return (
    <AppCard
      title="Basic Information"
      description="Identify your MCP server with a clear name and description."
      content={
        <form className="bg-background border rounded-2xl p-6">
          <FormInput
            required
            label="Name"
            id="name"
            name="name"
            value={value?.name || ''}
            placeholder="Enter name"
            onChange={(e) => {
              onSubmit({
                ...value,
                name: e.target.value,
              } as McpServer);
            }}
          />
          <div className="mt-4">
            <FormInput
              required
              label="Description"
              id="description"
              multiple
              name="description"
              value={value?.description || ''}
              placeholder="Enter description"
              onChange={(e) => {
                onSubmit({
                  ...value,
                  description: e.target.value,
                } as McpServer);
              }}
            />
          </div>
        </form>
      }
    />
  );
};

export default React.memo(AddMCPBasicInfo);
