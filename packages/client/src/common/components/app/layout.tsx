import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@gryffindor/client/common/components/shadcn/components/ui/sidebar";
import { Routes } from "@gryffindor/client/route/routes";
import { useNavigate } from "@tanstack/react-router";
import { BrainCircuit, Home, Moon, Sun, Workflow } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../api/decorators/hoc/authContextProvider";
import { Theme, ThemeContext } from "../../api/decorators/hoc/themeProvider";

export default function Layout(props: { children: React.ReactNode }) {
  const { isLoggedIn } = useContext(AuthContext);

  const { theme, setTheme } = useContext(ThemeContext);
  const isDarkTheme = theme === Theme.dark;

  const navigate = useNavigate();

  if (!isLoggedIn) {
    return <div className="h-screen bg-secondary flex">{props.children}</div>;
  }

  return (
    <div className="h-screen bg-secondary flex">
      <SidebarProvider defaultOpen={false}>
        <Sidebar collapsible="icon" variant="inset">
          <SidebarHeader>
            <SidebarMenuButton size="lg" className="my-1 cursor-pointer">
              <div
                className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600"
                onClick={() => navigate({ to: Routes.HOME })}
              >
                <Home className="size-5 text-white" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Griffyndor</span>
              </div>
            </SidebarMenuButton>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Ai Agent</SidebarGroupLabel>
              <SidebarMenuButton size="lg" className="my-1 cursor-pointer">
                <div
                  className="flex aspect-square size-8 items-center justify-center rounded-lg"
                  onClick={() => navigate({ to: Routes.AGENT_LIST })}
                >
                  <BrainCircuit className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Agents</span>
                </div>
              </SidebarMenuButton>
              <SidebarMenuButton size="lg" className="my-1 cursor-pointer">
                <div
                  className="flex aspect-square size-8 items-center justify-center rounded-lg"
                  onClick={() => navigate({ to: Routes.AI_WORKFLOW_LIST })}
                >
                  <Workflow className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Workflows</span>
                </div>
              </SidebarMenuButton>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div
              className="cursor-pointer"
              onClick={() => {
                setTheme(isDarkTheme ? Theme.light : Theme.dark);
              }}
            >
              {isDarkTheme ? <Moon /> : <Sun />}
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <SidebarTrigger className="m-3" />
          {props.children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
