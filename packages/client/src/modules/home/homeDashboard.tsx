import { Card, CardContent } from "@gryffindor/client/components/ui/card";
import { BrainCircuit, Workflow, Zap } from "lucide-react";
import { map } from "lodash";
import { Routes } from "@gryffindor/client/route/routes";

type Action = {
  icon: React.ReactNode;
  title: string;
  link: string;
};

const ACTIONS: Action[] = [
  {
    icon: <Zap />,
    title: "Build Agent",
    link: Routes.AGENT_CREATE,
  },
  {
    icon: <Workflow />,
    title: "Create Agentic Workflow",
    link: Routes.AGENT_WORKFLOW,
  },
  {
    icon: <BrainCircuit />,
    title: "Interact with Agent",
    link: Routes.AGENT_LIST,
  },
];

const HomeDashboard = () => {
  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex flex-col items-start">
        <span className="text-2xl font-bold my-8">
          What would you like to do?
        </span>
        <div className="grid grid-cols-3 gap-8">
          {map(ACTIONS, (action) => {
            return (
              <Card
                key={action.title}
                className="cursor-pointer hover:scale-105 hover:border-gray-400 transition-all"
              >
                <CardContent className="flex flex-col items-center">
                  <div>{action.icon}</div>
                  <div className="mt-3">{action.title}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
