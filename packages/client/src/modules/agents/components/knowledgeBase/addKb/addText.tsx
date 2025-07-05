import { Label } from "@gryffindor/client/common/components/shadcn/components/ui/label";
import { Textarea } from "@gryffindor/client/common/components/shadcn/components/ui/textarea";

type Props = {
  value?: string;
  onChange: (value: string) => void;
};

export default function AddText(props: Props) {
  const { value, onChange } = props;

  return (
    <div>
      <Label htmlFor="text" className="my-2">
        Text
      </Label>
      <Textarea
        id="text"
        placeholder="Enter text"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-h-[200px]"
      />
    </div>
  );
}
