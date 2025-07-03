import { Agent } from "@gryffindor/client/common/types/agent/agent.type";
import {
  FilterBuilder,
  SearchRequestBuilder,
} from "@gryffindor/client/common/api/common/request/requestBuilder";
import { useKnowledgeBaseQuery } from "@gryffindor/client/common/api/serverQueries/agent/useKnowldgeBaseQuery";
import { useMemo } from "react";
import { KnowledgeBaseType } from "@gryffindor/client/common/types/agent/ai.type";
import { File, Globe, Text, Trash } from "lucide-react";
import { map } from "lodash";
import { Button } from "@gryffindor/client/common/components/shadcn/components/ui/button";

type Props = {
  agent: Agent;
};

const KnowledgeBaseIcon = {
  [KnowledgeBaseType.FILE]: <File size={18} />,
  [KnowledgeBaseType.LINK]: <Globe size={18} />,
  [KnowledgeBaseType.TEXT]: <Text size={18} />,
};

export default function AddedKnowledgeBase(props: Props) {
  const { agent } = props;

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

  if (!data?.data?.length || isLoading) return null;

  return (
    <div className="bg-background p-4 rounded-xl border">
      {map(data.data, (kb) => {
        const Icon = KnowledgeBaseIcon[kb.type];
        return (
          <div
            key={kb._id}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary cursor-pointer"
          >
            <div className="flex items-center">
              <div className="p-2 bg-accent rounded-lg">{Icon}</div>
              <span className="mx-2"> {kb.name}</span>
            </div>
            <Button size="icon" variant="outline">
              <Trash />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
