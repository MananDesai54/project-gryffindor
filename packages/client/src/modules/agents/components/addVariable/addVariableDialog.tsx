import AppMenu from "@gryffindor/client/common/components/app/appMenu/appMenu";
import { ActionMenuItem } from "@gryffindor/client/common/components/app/appMenu/type";
import { Button } from "@gryffindor/client/common/components/shadcn/components/ui/button";
import { map } from "lodash";
import { useMemo } from "react";
import { NEW_VARIABLE_ID, Variable } from "./util/addVariable.util";

type Props = {
  addedVaribales?: string[];
  onAddVariable: (variableName: Variable) => void;
};

export default function AddVariableDialog(props: Props) {
  const { addedVaribales, onAddVariable } = props;

  const actions = useMemo(
    () =>
      [
        {
          label: "New Variable",
          onAction: () =>
            onAddVariable({
              label: NEW_VARIABLE_ID,
            }),
        },
        ...map(addedVaribales, (v) => ({
          label: v,
          onAction: () => onAddVariable({ label: v }),
        })),
      ] as ActionMenuItem[],
    [addedVaribales, onAddVariable],
  );

  return (
    <div className="flex items-center">
      <div className="flex text-xs mr-4">
        {map(addedVaribales, (v) => (
          <span
            className="px-2 py-1 rounded-full border-solid border cursor-pointer"
            onClick={() => onAddVariable({ label: v })}
          >
            {v}
          </span>
        ))}
      </div>
      <AppMenu
        trigger={
          <Button className="rounded-full" variant="outline" size="sm">
            + <span className="text-xs">Add Variable</span>
          </Button>
        }
        actions={actions}
      />
    </div>
  );
}
