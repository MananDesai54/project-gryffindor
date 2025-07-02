import { IdLabel } from "@gryffindor/client/common/types/idLabel.type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shadcn/components/ui/select";
import { map } from "lodash";

type Props = {
  options: IdLabel[];
  onChange: (value: string) => void;
  value?: string;
  placeholder?: string;
};

export default function AppSelect(props: Props) {
  const { options, onChange, value, placeholder } = props;

  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-[180px] cursor-pointer">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {map(options, (o) => (
          <SelectItem value={o.id} className="cursor-pointer">
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
