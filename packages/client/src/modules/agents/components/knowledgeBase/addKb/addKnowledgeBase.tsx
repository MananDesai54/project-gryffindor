import AppMenu from "@gryffindor/client/common/components/app/appMenu/appMenu";
import { ActionMenuItem } from "@gryffindor/client/common/components/app/appMenu/type";
import AppModal from "@gryffindor/client/common/components/app/appModal/appModal";
import { Button } from "@gryffindor/client/common/components/shadcn/components/ui/button";
import { Input } from "@gryffindor/client/common/components/shadcn/components/ui/input";
import { Label } from "@gryffindor/client/common/components/shadcn/components/ui/label";
import { KnowledgeBaseTypeLabel } from "@gryffindor/client/common/constants/agent/knowledgeBase.constant";
import { KnowledgeBaseType } from "@gryffindor/client/common/types/agent/ai.type";
import { KnowledgeBase } from "@gryffindor/client/common/types/agent/knowledgeBase.type";
import { useCallback, useMemo, useState } from "react";
import AddFile from "./addDocument";
import AddLink from "./addLink";
import AddText from "./addText";

type Props = {
  onSaveKnowledgeBase: (knowledgeBase: KnowledgeBase) => void;
};

export function AddKnowledgeBase(props: Props) {
  const { onSaveKnowledgeBase } = props;

  const [newKnowledgeBase, setNewKnowledgeBase] = useState<KnowledgeBase>();
  const [activeKnowledgeBaseType, setActiveKnowledgeBaseType] =
    useState<KnowledgeBaseType>();

  const onSave = useCallback(() => {
    if (!newKnowledgeBase || !activeKnowledgeBaseType) return;
    onSaveKnowledgeBase({
      ...newKnowledgeBase,
      type: activeKnowledgeBaseType,
    });
    setActiveKnowledgeBaseType(undefined);
  }, [activeKnowledgeBaseType, newKnowledgeBase, onSaveKnowledgeBase]);

  const actions = useMemo(
    () =>
      [
        {
          label: `Add ${KnowledgeBaseTypeLabel[KnowledgeBaseType.LINK]}`,
          onAction: () => setActiveKnowledgeBaseType(KnowledgeBaseType.LINK),
        },
        {
          label: `Add ${KnowledgeBaseTypeLabel[KnowledgeBaseType.FILE]}`,
          onAction: () => setActiveKnowledgeBaseType(KnowledgeBaseType.FILE),
        },
        {
          label: `Add ${KnowledgeBaseTypeLabel[KnowledgeBaseType.TEXT]}`,
          onAction: () => setActiveKnowledgeBaseType(KnowledgeBaseType.TEXT),
        },
      ] as ActionMenuItem[],
    [],
  );

  return (
    <>
      <AppMenu
        trigger={<Button variant="outline">Add document</Button>}
        actions={actions}
      />
      <AppModal
        title={`Add ${KnowledgeBaseTypeLabel[activeKnowledgeBaseType!]}`}
        open={Boolean(activeKnowledgeBaseType)}
        content={
          <div>
            <div className="my-4">
              <Label htmlFor="name" className="my-2">
                Name
              </Label>
              <Input
                id="name"
                type="name"
                placeholder="Enter name"
                required
                value={newKnowledgeBase?.name}
                onChange={(e) =>
                  setNewKnowledgeBase({
                    ...newKnowledgeBase,
                    name: e.target.value,
                  } as KnowledgeBase)
                }
              />
            </div>
            {activeKnowledgeBaseType === KnowledgeBaseType.LINK ? (
              <AddLink
                value={newKnowledgeBase?.url}
                onChange={(url) =>
                  setNewKnowledgeBase({
                    ...newKnowledgeBase,
                    url,
                  } as KnowledgeBase)
                }
              />
            ) : null}
            {activeKnowledgeBaseType === KnowledgeBaseType.FILE ? (
              <AddFile
                onChange={(file) =>
                  setNewKnowledgeBase({
                    ...newKnowledgeBase,
                    ...file,
                  } as KnowledgeBase)
                }
              />
            ) : null}
            {activeKnowledgeBaseType === KnowledgeBaseType.TEXT ? (
              <AddText
                value={newKnowledgeBase?.url}
                onChange={(content) =>
                  setNewKnowledgeBase({
                    ...newKnowledgeBase,
                    content,
                  } as KnowledgeBase)
                }
              />
            ) : null}
          </div>
        }
        onClose={() => setActiveKnowledgeBaseType(undefined)}
        onSave={onSave}
        submitLabel={`Add ${KnowledgeBaseTypeLabel[activeKnowledgeBaseType!]}`}
      />
    </>
  );
}
