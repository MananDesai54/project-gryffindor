import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Routes } from "@/routes/routes";
import React from "react";

const Login = React.lazy(() => import("@/modules/login/login"));
const HomeDashboard = React.lazy(() => import("@/modules/home/homeDashboard"));

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
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
  getParentRoute: () => rootRoute,
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
