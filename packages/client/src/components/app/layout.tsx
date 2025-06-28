import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@gryffindor/client/components/ui/sidebar";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div className="h-screen bg-secondary flex">
      <SidebarProvider>
        <Sidebar collapsible="offcanvas" variant="inset" defaultChecked={true}>
          <SidebarHeader>Gryffindor</SidebarHeader>
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
