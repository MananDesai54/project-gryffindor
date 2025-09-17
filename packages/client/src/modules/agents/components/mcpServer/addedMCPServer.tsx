import { Button } from '@gryffindor/client/common/components/shadcn/components/ui/button';
import { McpServer } from '@gryffindor/client/common/types/agent/mcpServer.type';
import { map } from 'lodash';
import { Server, Trash } from 'lucide-react';

type Props = {
  mcpServers: McpServer[];
  onDeleteMCPServer(id: string): void;
};

export default function AddedMCPServer(props: Props) {
  const { mcpServers, onDeleteMCPServer } = props;

  if (!mcpServers?.length) return null;

  return (
    <div className="bg-background p-4 rounded-xl border">
      {map(mcpServers, (mcpServer) => {
        return (
          <div
            key={mcpServer._id}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary cursor-pointer w-full"
          >
            <div className="flex items-center">
              <div className="p-2 bg-accent rounded-lg">{<Server />}</div>
              <div className="mx-2 truncate max-w-[500px]">
                {mcpServer.name}
              </div>
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                onDeleteMCPServer(mcpServer._id);
              }}
            >
              <Trash />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
