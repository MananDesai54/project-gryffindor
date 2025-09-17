import AppCard from '@gryffindor/client/common/components/app/appCard/appCard';
import FormInput from '@gryffindor/client/common/components/app/formInput';
import { Button } from '@gryffindor/client/common/components/shadcn/components/ui/button';
import { McpServer } from '@gryffindor/client/common/types/agent/mcpServer.type';
import { map } from 'lodash';
import { Trash } from 'lucide-react';
import React from 'react';

//  Types

type Props = {
  mcpServer: Partial<McpServer>;
  onChange: (mcpServer: McpServer) => void;
};

//  Global Constants & Functions

const AddMCPHeaders = (props: Props) => {
  //  Props Destructure
  const { mcpServer, onChange: onSubmit } = props;

  //  State Variables

  //  Queries and Mutations

  //  Constant, Refs and Memo Constant

  //  Helper Functions

  //  Handlers

  //  Effects

  return (
    <>
      <AppCard
        title="HTTP Headers"
        description="Add custom headers for additional configuration or authentication."
        cardAction={
          <Button
            variant="outline"
            onClick={() => {
              onSubmit({
                ...mcpServer,
                requestHeaders: [
                  ...(mcpServer.requestHeaders || []),
                  { name: '', value: '' },
                ],
              } as McpServer);
            }}
          >
            Add Header
          </Button>
        }
        content={map(mcpServer.requestHeaders, (header, index) => (
          <div className="flex items-center" key={index}>
            <form className="bg-background border rounded-2xl p-6 my-3 flex-1">
              <FormInput
                required
                label="Name"
                id="name"
                name="name"
                value={header.name || ''}
                placeholder="Enter name"
                onChange={(e) => {
                  onSubmit({
                    ...mcpServer,
                    requestHeaders: map(mcpServer.requestHeaders, (h, i) =>
                      i === index ? { ...h, name: e.target.value } : h
                    ),
                  } as McpServer);
                }}
              />
              <div className="mt-4">
                <FormInput
                  required
                  label="Value"
                  id="value"
                  name="value"
                  value={header.value || ''}
                  placeholder="Enter value"
                  onChange={(e) => {
                    onSubmit({
                      ...mcpServer,
                      requestHeaders: map(mcpServer.requestHeaders, (h, i) =>
                        i === index ? { ...h, value: e.target.value } : h
                      ),
                    } as McpServer);
                  }}
                />
              </div>
            </form>
            <Button
              variant="outline"
              className="mt-6 ml-3"
              size="icon"
              onClick={() => {
                onSubmit({
                  ...mcpServer,
                  requestHeaders: mcpServer.requestHeaders?.filter(
                    (_, i) => i !== index
                  ),
                } as McpServer);
              }}
            >
              <Trash color="red" />
            </Button>
          </div>
        ))}
      />
    </>
  );
};

export default React.memo(AddMCPHeaders);
