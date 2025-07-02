import { useAgentQuery } from "@gryffindor/client/common/api/serverQueries/agent/useAgentQuery";
import AppBreadcrumb from "@gryffindor/client/common/components/app/appBreadcrumb/appBreadcrumb";
import { BreadcrumbItemType } from "@gryffindor/client/common/components/app/appBreadcrumb/type";
import AppMenu from "@gryffindor/client/common/components/app/appMenu/appMenu";
import { ActionMenuItem } from "@gryffindor/client/common/components/app/appMenu/type";
import Loader from "@gryffindor/client/common/components/app/loader";
import { Button } from "@gryffindor/client/common/components/shadcn/components/ui/button";
import { Input } from "@gryffindor/client/common/components/shadcn/components/ui/input";
import { Routes } from "@gryffindor/client/route/routes";
import { useParams } from "@tanstack/react-router";
import { BrainCircuit, Copy } from "lucide-react";
import { useMemo } from "react";

export default function AgentDetailScreen() {
  const params = useParams({
    from: Routes.AGENT_DETAIL,
  });

  const { data, isLoading } = useAgentQuery({
    queryParams: {
      id: params.id,
    },
  });

  const breadCrumbItems = useMemo(
    () =>
      [
        { label: "Agents", link: Routes.AGENT_LIST },
        { label: data?.name || "Loading..." },
      ] as BreadcrumbItemType[],
    [data?.name],
  );

  const actions = [
    {
      label: "Delete Agent",
      variant: "danger",
      onAction: () => {},
    },
  ] as ActionMenuItem[];

  if (isLoading) {
    return (
      <Loader className="w-screen h-screen flex justify-center items-center" />
    );
  }

  return (
    <div className="w-full">
      <header className="p-2 border-y flex justify-between items-center">
        <AppBreadcrumb items={breadCrumbItems} />
        <div className="flex items-center">
          <Button>
            <BrainCircuit /> Test Agent
          </Button>
          <Button className="mx-4" variant="outline">
            <Copy /> Copy Url
          </Button>
          <AppMenu actions={actions} />
        </div>
      </header>
      <section>
        <Input defaultValue={data?.name} onChange={} />
      </section>
    </div>
  );
}
