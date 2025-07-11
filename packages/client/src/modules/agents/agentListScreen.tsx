import { useAgentQuery } from "@gryffindor/client/common/api/serverQueries/agent/useAgentQuery";
import { Button } from "@gryffindor/client/common/components/shadcn/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@gryffindor/client/common/components/shadcn/components/ui/table";
import { Routes } from "@gryffindor/client/route/routes";
import { Link } from "@tanstack/react-router";
import { map } from "lodash";
import { Trash } from "lucide-react";

export default function AgentListScreen() {
  const { data: agents } = useAgentQuery({});

  return (
    <section className="w-4/5 flex flex-col items-center overflow-auto mx-auto my-8">
      <header className="border-b w-full p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Agents</h1>
          <span className="text-muted-foreground">
            Create and manage agents
          </span>
        </div>
        <Link to={Routes.AGENT_CREATE}>
          <Button>+ Create Agent</Button>
        </Link>
      </header>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Agent Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {map(agents?.data, (agent) => (
            <TableRow key={agent._id}>
              <TableCell>
                <Link
                  to={Routes.AGENT_DETAIL}
                  params={{ id: agent._id }}
                  className="underline"
                >
                  {agent.name}
                </Link>
              </TableCell>
              <TableCell className="truncate">{agent.description}</TableCell>
              <TableCell>{new Date(agent.createdAt).toISOString()}</TableCell>
              <TableCell>
                <Button variant="outline" size="icon">
                  <Trash />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
