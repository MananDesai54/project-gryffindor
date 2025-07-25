import { useAiWorkflowQuery } from "@gryffindor/client/common/api/serverQueries/aiWorkflow/useAiWorkflowQuery";
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

export default function AiWorkflowListScreen() {
  const { data: aiWorkflows } = useAiWorkflowQuery({});

  return (
    <section className="w-4/5 flex flex-col items-center overflow-auto mx-auto my-8">
      <header className="border-b w-full p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Workflows</h1>
          <span className="text-muted-foreground">
            Create and manage workflows
          </span>
        </div>
        <Link to={Routes.AI_WORKFLOW_CREATE}>
          <Button>+ Create Workflow</Button>
        </Link>
      </header>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Workflow Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {map(aiWorkflows?.data, (aiWorkflow) => (
            <TableRow key={aiWorkflow._id}>
              <TableCell>
                <Link
                  to={Routes.AI_WORKFLOW_DETAIL}
                  params={{ id: aiWorkflow._id }}
                  className="underline"
                >
                  {aiWorkflow.name}
                </Link>
              </TableCell>
              <TableCell className="truncate">
                {aiWorkflow.description}
              </TableCell>
              <TableCell>
                {new Date(aiWorkflow.createdAt).toISOString()}
              </TableCell>
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
