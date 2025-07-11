import {
  FilterBuilder,
  SearchRequestBuilder,
} from "@gryffindor/client/common/api/common/request/requestBuilder";
import { useKnowledgeBaseQuery } from "@gryffindor/client/common/api/serverQueries/agent/useKnowldgeBaseQuery";
import { useCreateKnowledgeBaseMutation } from "@gryffindor/client/common/api/serverQueries/agent/useKnowledgeBaseMutation";
import AppCard from "@gryffindor/client/common/components/app/appCard/appCard";
import { Agent } from "@gryffindor/client/common/types/agent/agent.type";
import { KnowledgeBase } from "@gryffindor/client/common/types/agent/knowledgeBase.type";
import { reject } from "lodash";
import { useCallback, useMemo } from "react";
import { AddKnowledgeBase } from "./addKb/addKnowledgeBase";
import AddedKnowledgeBase from "./addedKnowledgeBase";

type Props = {
  agent: Agent;
  onChange: (config: Partial<Agent["configuration"]>) => void;
};

export default function KnowledgeBaseConfig(props: Props) {
  const { agent, onChange } = props;

  const { mutateAsync: createKb } = useCreateKnowledgeBaseMutation();

  const request = useMemo(
    () =>
      new SearchRequestBuilder()
        .addFilter(
          new FilterBuilder()
            .field("_id")
            .value(agent?.configuration?.knowledgeBase || [])
            .build(),
        )
        .build(),
    [agent?.configuration?.knowledgeBase],
  );
  const { data, isLoading } = useKnowledgeBaseQuery({
    queryParams: request,
    reactQueryOptions: {
      enabled: !!agent?.configuration?.knowledgeBase?.length,
    },
  });

  const onSaveKnowledgeBase = useCallback(
    async (newKnowledgeBase: KnowledgeBase) => {
      if (!newKnowledgeBase) return;
      newKnowledgeBase.dependentAgents = [agent._id];
      const kb = await createKb({
        kb: newKnowledgeBase,
      });
      onChange({
        knowledgeBase: [...(agent?.configuration?.knowledgeBase || []), kb._id],
      });
    },
    [agent._id, agent?.configuration?.knowledgeBase, createKb, onChange],
  );

  const onDeleteKnowledgeBase = useCallback(
    (id: string) => {
      onChange({
        knowledgeBase: reject(
          agent.configuration?.knowledgeBase,
          (v) => v === id,
        ),
      });
    },
    [agent.configuration?.knowledgeBase, onChange],
  );

  return (
    <AppCard
      title="Agent knowledge base"
      description="Provide the LLM with domain-specific information to help it answer questions more accurately."
      cardAction={
        <AddKnowledgeBase onSaveKnowledgeBase={onSaveKnowledgeBase} />
      }
      content={
        data?.data?.length && !isLoading ? (
          <AddedKnowledgeBase
            kbs={data?.data}
            onDeleteKnowledgeBase={onDeleteKnowledgeBase}
          />
        ) : null
      }
    />
  );
}
