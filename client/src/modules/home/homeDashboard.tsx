import { Card, CardContent } from "@/components/ui/card";
import { BrainCircuit, Workflow, Zap } from "lucide-react";
import { map } from "lodash";
import { Routes } from "@/routes/routes";

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
    <div className="flex justify-center pt-8">
      {map(ACTIONS, (action) => {
        return (
          <Card
            key={action.title}
            className="mx-3 w-1/6 cursor-pointer hover:scale-105 transition-[scale]"
          >
            <CardContent className="flex flex-col items-center">
              <div>{action.icon}</div>
              <div className="mt-3">{action.title}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default HomeDashboard;
