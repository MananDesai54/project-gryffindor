import { ComponentProps } from "react";
import { Input } from "../shadcn/components/ui/input";
import { Label } from "../shadcn/components/ui/label";
import classNames from "classnames";

type Props = ComponentProps<"input"> & {
  label?: string;
};

export default function FormInput(props: Props) {
  return (
    <div className={classNames("my-2", props.className)}>
      {props.label && (
        <Label htmlFor={props.id} className="mb-2">
          {props.label}
        </Label>
      )}
      <Input {...props} />
    </div>
  );
}
