import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@gryffindor/client/common/components/shadcn/components/ui/collapsible";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@gryffindor/client/common/components/shadcn/components/ui/sidebar";
import {
  AiWorkflowComponentCategory,
  BaseWorkflowComponent,
} from "@gryffindor/client/common/types/ai-workflow/ai-workflow.type";
import { map } from "lodash";
import { ChevronRight } from "lucide-react";

type Props = {
  workflowComponents: Record<
    AiWorkflowComponentCategory,
    BaseWorkflowComponent[]
  >;
};

export function SettingsPanel(props: Props) {
  const { workflowComponents } = props;

  return (
    <div className="w-[400px] bg-background">
      <SidebarContent className="gap-0">
        {map(
          workflowComponents,
          (
            components: BaseWorkflowComponent[],
            category: AiWorkflowComponentCategory,
          ) => (
            <Collapsible
              key={category}
              title={category}
              className="group/collapsible"
            >
              <SidebarGroup className="!py-0">
                <SidebarGroupLabel
                  asChild
                  className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm cursor-pointer"
                >
                  <CollapsibleTrigger>
                    {category}
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu className="p-2">
                      {map(components, (component: BaseWorkflowComponent) => (
                        <SidebarMenuItem key={category}>
                          <SidebarMenuButton
                            asChild
                            className="cursor-pointer bg-secondary p-5 my-1 border border-transparent hover:border-gray-400"
                          >
                            <div>{component.name}</div>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          ),
        )}
      </SidebarContent>
      <SidebarRail />
    </div>
  );
}
