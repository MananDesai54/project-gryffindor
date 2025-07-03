import { Input } from "@gryffindor/client/common/components/shadcn/components/ui/input";
import { Label } from "@gryffindor/client/common/components/shadcn/components/ui/label";

type Props = {
  value?: string;
  onChange: (value: string) => void;
};

export default function AddLink(props: Props) {
  const { value, onChange } = props;

  return (
    <div>
      <Label htmlFor="url" className="my-2">
        URL
      </Label>
      <Input
        id="url"
        type="url"
        placeholder="https://example.com"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
