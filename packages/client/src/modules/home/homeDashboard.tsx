import AppCard from "@gryffindor/client/common/components/app/appCard/appCard";
import { Routes } from "@gryffindor/client/route/routes";
import { Link } from "@tanstack/react-router";
import { map } from "lodash";
import { BrainCircuit, Zap } from "lucide-react";

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
  // {
  //   icon: <Workflow />,
  //   title: "Create Agentic Workflow",
  //   link: Routes.AGENT_WORKFLOW,
  // },
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
              <Link to={action.link} key={action.title}>
                <AppCard
                  className="cursor-pointer hover:scale-105 hover:border-gray-400 transition-all"
                  content={
                    <div className="flex flex-col items-center">
                      <div>{action.icon}</div>
                      <div className="mt-3">{action.title}</div>
                    </div>
                  }
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
