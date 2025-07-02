import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@gryffindor/client/common/components/shadcn/components/ui/sidebar";
import { useContext } from "react";
import { AuthContext } from "../../api/decorators/hoc/authContextProvider";

export default function Layout(props: { children: React.ReactNode }) {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <div className="h-screen bg-secondary flex">{props.children}</div>;
  }

  return (
    <div className="h-screen bg-secondary flex">
      <SidebarProvider defaultOpen={false}>
        <Sidebar collapsible="icon" variant="inset">
          <SidebarHeader></SidebarHeader>
          <SidebarContent>
            <SidebarGroup />
            <SidebarGroup />
          </SidebarContent>
          <SidebarFooter></SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <SidebarTrigger className="m-3" />
          {props.children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
