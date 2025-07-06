import { useUpdateAgentMutation } from "@gryffindor/client/common/api/serverQueries/agent/useAgentMutation";
import { useAgentByIdQuery } from "@gryffindor/client/common/api/serverQueries/agent/useAgentQuery";
import AppBreadcrumb from "@gryffindor/client/common/components/app/appBreadcrumb/appBreadcrumb";
import { BreadcrumbItemType } from "@gryffindor/client/common/components/app/appBreadcrumb/type";
import AppMenu from "@gryffindor/client/common/components/app/appMenu/appMenu";
import { ActionMenuItem } from "@gryffindor/client/common/components/app/appMenu/type";
import Loader from "@gryffindor/client/common/components/app/loader";
import { Button } from "@gryffindor/client/common/components/shadcn/components/ui/button";
import { Agent } from "@gryffindor/client/common/types/agent/agent.type";
import { Routes } from "@gryffindor/client/route/routes";
import { useNavigate, useParams } from "@tanstack/react-router";
import { BrainCircuit, Copy, TriangleAlert } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import AgentConfigurations from "./components/agentConfigurations";
import { Input } from "@gryffindor/client/common/components/shadcn/components/ui/input";
import { Textarea } from "@gryffindor/client/common/components/shadcn/components/ui/textarea";
import { NotifySuccess } from "@gryffindor/client/common/components/app/toast";

export default function AgentDetailScreen() {
  const params = useParams({
    from: Routes.AGENT_DETAIL,
  });
  const navigate = useNavigate();

  const { data, isLoading } = useAgentByIdQuery({
    queryParams: {
      id: params.id,
    },
  });
  const { mutate } = useUpdateAgentMutation();
  const [tempAgent, setTempAgent] = useState<Agent | undefined>(data);

  const breadCrumbItems = useMemo(
    () =>
      [
        { label: "Agents", link: Routes.AGENT_LIST },
        { label: data?.name || "Loading..." },
      ] as BreadcrumbItemType[],
    [data?.name],
  );

  const isDirty = useMemo(() => {
    if (!tempAgent || !data) return false;
    return JSON.stringify(tempAgent) !== JSON.stringify(data);
  }, [tempAgent, data]);

  const actions = useMemo(
    () =>
      [
        {
          label: "Delete Agent",
          variant: "danger",
          onAction: () => {},
        },
      ] as ActionMenuItem[],
    [],
  );

  const onUpdateAgent = useCallback((agent: Partial<Agent>) => {
    setTempAgent((tempAgent) => ({ ...(tempAgent as Agent), ...agent }));
  }, []);

  const onUpdateAgentConfiguration = useCallback(
    (config: Partial<Agent["configuration"]>) => {
      onUpdateAgent({
        configuration: {
          ...tempAgent?.configuration,
          ...config,
        } as Agent["configuration"],
      });
    },
    [onUpdateAgent, tempAgent],
  );

  const onSaveAgent = useCallback(() => {
    if (!data?._id || !tempAgent) return;
    mutate({
      agentId: data._id,
      agent: tempAgent!,
    });
  }, [data?._id, mutate, tempAgent]);

  const onCancelAgent = useCallback(() => {
    setTempAgent(data);
  }, [data]);

  useEffect(() => {
    setTempAgent(data);
  }, [data]);

  if (isLoading) {
    return (
      <Loader className="w-screen h-screen flex justify-center items-center" />
    );
  }

  return (
    <div className="w-full flex flex-col items-center relative overflow-auto">
      <header className="p-2 border-y flex justify-between items-center w-full sticky top-0 z-10 bg-background">
        <AppBreadcrumb items={breadCrumbItems} />
        <div className="flex items-center">
          <Button
            onClick={() => {
              navigate({
                to: Routes.AGENT_INFERENCE,
                params: { id: tempAgent?._id },
              });
            }}
          >
            <BrainCircuit /> Test Agent
          </Button>
          <Button
            className="mx-4"
            variant="outline"
            onClick={() => {
              navigator.clipboard
                .writeText(
                  `${window.location.origin}${Routes.AGENT_INFERENCE}`.replace(
                    "$id",
                    tempAgent?._id || "",
                  ),
                )
                .then(() => {
                  NotifySuccess("Agent's URL Copied to clipboard");
                });
            }}
          >
            <Copy /> Copy Url
          </Button>
          <AppMenu actions={actions} />
        </div>
      </header>
      <section className="w-1/2 flex flex-col items-center flex-1">
        <div className="my-4 w-full flex flex-col border-b">
          <Input
            required
            value={tempAgent?.name}
            className="!bg-transparent w-1/4 border-none p-1"
            onChange={(e) => onUpdateAgent({ name: e.target.value })}
            placeholder="Enter agent name..."
          />
          <Textarea
            className="!bg-transparent border-none my-2 text-gray-500 w-1/2 p-1 resize-none"
            value={tempAgent?.description}
            onChange={(e) => onUpdateAgent({ description: e.target.value })}
            placeholder="Enter agent description..."
          />
        </div>
        {tempAgent ? (
          <AgentConfigurations
            onChange={onUpdateAgentConfiguration}
            agent={tempAgent}
          />
        ) : undefined}
      </section>
      {isDirty ? (
        <motion.div
          className="fixed w-1/2 z-10"
          initial={{ opacity: 0, bottom: 0 }}
          animate={{ opacity: 1, bottom: 50 }}
          exit={{ opacity: 0, bottom: 0 }}
        >
          <div className="w-full mx-4 rounded-lg bg-background border p-2 flex justify-between items-center">
            <div className="flex items-center">
              <TriangleAlert size={18} />
              <div className="mx-2">You have unsaved changes</div>
            </div>
            <div>
              <Button
                onClick={onCancelAgent}
                variant="outline"
                className="mx-2"
              >
                Clear
              </Button>
              <Button onClick={onSaveAgent}>Save</Button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
