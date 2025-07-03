import { useCreateKnowledgeBaseMutation } from "@gryffindor/client/common/api/serverQueries/agent/useKnowledgeBaseMutation";
import AppCard from "@gryffindor/client/common/components/app/appCard/appCard";
import { Agent } from "@gryffindor/client/common/types/agent/agent.type";
import { KnowledgeBase } from "@gryffindor/client/common/types/agent/knowledgeBase.type";
import { useCallback } from "react";
import { AddKnowledgeBase } from "./addKb/addKnowledgeBase";
import AddedKnowledgeBase from "./addedKnowledgeBase";

type Props = {
  agent: Agent;
  onChange: (config: Partial<Agent["configuration"]>) => void;
};

export default function KnowledgeBaseConfig(props: Props) {
  const { agent, onChange } = props;

  const { mutateAsync } = useCreateKnowledgeBaseMutation();

  const onSaveKnowledgeBase = useCallback(
    async (newKnowledgeBase: KnowledgeBase) => {
      if (!newKnowledgeBase) return;
      const kb = await mutateAsync({
        kb: newKnowledgeBase,
      });
      onChange({
        knowledgeBase: [...(agent?.configuration?.knowledgeBase || []), kb._id],
      });
    },
    [agent?.configuration?.knowledgeBase, mutateAsync, onChange],
  );

  return (
    <AppCard
      title="Agent knowledge base"
      description="Provide the LLM with domain-specific information to help it answer questions more accurately."
      cardAction={
        <AddKnowledgeBase onSaveKnowledgeBase={onSaveKnowledgeBase} />
      }
      content={<AddedKnowledgeBase agent={agent} />}
    />
  );
}
