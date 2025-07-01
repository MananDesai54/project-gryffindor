import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Routes } from "@gryffindor/client/route/routes";
import React from "react";
import Layout from "../common/components/app/layout";
import ReactQueryProvider from "../common/api/common/reactQueryProvider";
import { Toaster } from "../common/components/shadcn/components/ui/sonner";

const Login = React.lazy(
  () => import("@gryffindor/client/modules/login/login"),
);
const HomeDashboard = React.lazy(
  () => import("@gryffindor/client/modules/home/homeDashboard"),
);

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <ReactQueryProvider>
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
        <Toaster />
      </ReactQueryProvider>
    </Layout>
  ),
});

const homeRoute = createRoute({
  path: Routes.HOME,
  component: HomeDashboard,
  getParentRoute: () => rootRoute,
});

const loginRoute = createRoute({
  path: Routes.LOGIN,
  component: Login,
  getParentRoute: () => rootRoute,
});

const agentRoute = createRoute({
  path: Routes.AGENT,
  component: () => <div>Agent</div>,
  getParentRoute: () => homeRoute,
});

const agentWorkflowRoute = createRoute({
  path: Routes.AGENT_WORKFLOW,
  component: () => <div>Agent Workflow</div>,
  getParentRoute: () => agentRoute,
});

const agentCreate = createRoute({
  path: Routes.AGENT_CREATE,
  component: () => <div>Agent Create</div>,
  getParentRoute: () => agentRoute,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  agentRoute.addChildren([agentWorkflowRoute, agentCreate]),
]);

const router = createRouter({ routeTree });

export default function AppRouterProvider() {
  return <RouterProvider router={router} />;
}
