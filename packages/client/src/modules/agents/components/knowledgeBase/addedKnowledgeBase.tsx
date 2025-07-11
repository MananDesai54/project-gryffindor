import { Button } from "@gryffindor/client/common/components/shadcn/components/ui/button";
import { KnowledgeBaseType } from "@gryffindor/client/common/types/agent/ai.type";
import { KnowledgeBase } from "@gryffindor/client/common/types/agent/knowledgeBase.type";
import { map } from "lodash";
import { File, Globe, Text, Trash } from "lucide-react";

type Props = {
  kbs: KnowledgeBase[];
  onDeleteKnowledgeBase(id: string): void;
};

const KnowledgeBaseIcon = {
  [KnowledgeBaseType.FILE]: <File size={18} />,
  [KnowledgeBaseType.LINK]: <Globe size={18} />,
  [KnowledgeBaseType.TEXT]: <Text size={18} />,
};

export default function AddedKnowledgeBase(props: Props) {
  const { kbs, onDeleteKnowledgeBase } = props;

  if (!kbs?.length) return null;

  return (
    <div className="bg-background p-4 rounded-xl border">
      {map(kbs, (kb) => {
        const Icon = KnowledgeBaseIcon[kb.type];
        return (
          <div
            key={kb._id}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary cursor-pointer w-full"
          >
            <div className="flex items-center">
              <div className="p-2 bg-accent rounded-lg">{Icon}</div>
              <div className="mx-2 truncate max-w-[500px]"> {kb.name}</div>
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                onDeleteKnowledgeBase(kb._id);
              }}
            >
              <Trash />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
