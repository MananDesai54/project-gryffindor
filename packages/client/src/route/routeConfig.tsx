import { Routes } from "@gryffindor/client/route/routes";
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import React from "react";
import ReactQueryProvider from "../common/api/common/reactQueryProvider";
import Layout from "../common/components/app/layout";
import { Toaster } from "../common/components/shadcn/components/ui/sonner";
import ProtectedRoute from "./protectedRoute";

const Login = React.lazy(
  () => import("@gryffindor/client/modules/login/login"),
);
const HomeDashboard = React.lazy(
  () => import("@gryffindor/client/modules/home/homeDashboard"),
);
const AgentCreateScreen = React.lazy(
  () => import("@gryffindor/client/modules/agents/agentCreateScreen"),
);
const AgentDetailScreen = React.lazy(
  () => import("@gryffindor/client/modules/agents/agentDetailsScreen"),
);
const AgentListScreen = React.lazy(
  () => import("@gryffindor/client/modules/agents/agentListScreen"),
);
const AgentInferenceScreen = React.lazy(
  () => import("@gryffindor/client/modules/agents/agentInferenceScreen"),
);
const AiWorkflowCreateScreen = React.lazy(
  () => import("@gryffindor/client/modules/ai-workflow/aiWorkflowCreateScreen"),
);
const AiWorkflowDetails = React.lazy(
  () => import("@gryffindor/client/modules/ai-workflow/aiWorkflowDetails"),
);
const AiWorkflowListScreen = React.lazy(
  () => import("@gryffindor/client/modules/ai-workflow/aiWorkflowListScreen"),
);

const rootRoute = createRootRoute({
  component: () => (
    <AnimatePresence>
      <Layout>
        <ReactQueryProvider>
          <Outlet />
          {/* <TanStackRouterDevtools position="bottom-left"  /> */}
          <Toaster />
        </ReactQueryProvider>
      </Layout>
    </AnimatePresence>
  ),
});

const loginRoute = createRoute({
  path: Routes.LOGIN,
  component: Login,
  getParentRoute: () => rootRoute,
});

const protectedAppRoute = createRoute({
  path: Routes.APP,
  component: ProtectedRoute,
  getParentRoute: () => rootRoute,
});
const homeRoute = createRoute({
  path: Routes.HOME,
  component: HomeDashboard,
  getParentRoute: () => protectedAppRoute,
});
const agentCreate = createRoute({
  path: Routes.AGENT_CREATE,
  component: AgentCreateScreen,
  getParentRoute: () => protectedAppRoute,
});
const agentDetail = createRoute({
  path: Routes.AGENT_DETAIL,
  component: AgentDetailScreen,
  getParentRoute: () => protectedAppRoute,
});
const agentList = createRoute({
  path: Routes.AGENT_LIST,
  component: AgentListScreen,
  getParentRoute: () => protectedAppRoute,
});
const agentInferenceRoute = createRoute({
  path: Routes.AGENT_INFERENCE,
  component: AgentInferenceScreen,
  getParentRoute: () => protectedAppRoute,
});
const workflowList = createRoute({
  path: Routes.AI_WORKFLOW_LIST,
  component: AiWorkflowListScreen,
  getParentRoute: () => protectedAppRoute,
});
const workflowCreate = createRoute({
  path: Routes.AI_WORKFLOW_CREATE,
  component: AiWorkflowCreateScreen,
  getParentRoute: () => protectedAppRoute,
});
const workflowDetail = createRoute({
  path: Routes.AI_WORKFLOW_DETAIL,
  component: AiWorkflowDetails,
  getParentRoute: () => protectedAppRoute,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  protectedAppRoute.addChildren([
    homeRoute,
    agentCreate,
    agentDetail,
    agentList,
    agentInferenceRoute,
    workflowList,
    workflowCreate,
    workflowDetail,
  ]),
]);

const router = createRouter({ routeTree });

export default function AppRouterProvider() {
  return <RouterProvider router={router} />;
}
