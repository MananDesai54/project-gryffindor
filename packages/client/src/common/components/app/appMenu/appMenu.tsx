import { map } from "lodash";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../shadcn/components/ui/dropdown-menu";
import { ActionMenuItem } from "./type";
import cx from "classnames";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../../shadcn/components/ui/button";

type Props = {
  title?: string;
  actions: ActionMenuItem[];
  trigger?: React.ReactNode;
};

export default function AppMenu({ title, actions, trigger }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {trigger || (
          <Button variant="outline" size="icon">
            <MoreHorizontal />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {title ? (
          <>
            <DropdownMenuLabel>{title}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        ) : null}
        {map(actions, (action) => {
          return (
            <DropdownMenuItem
              onClick={action.onAction}
              key={action.label}
              className={cx("flex items-center cursor-pointer")}
            >
              {action.icon}
              <div className="mx-2">{action.label}</div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
