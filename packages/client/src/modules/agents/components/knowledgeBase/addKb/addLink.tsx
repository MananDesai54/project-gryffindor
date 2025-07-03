import FormInput from "@gryffindor/client/common/components/app/formInput";

type Props = {
  value?: string;
  onChange: (value: string) => void;
};

export default function AddLink(props: Props) {
  const { value, onChange } = props;

  return (
    <FormInput
      label="URL"
      id="url"
      type="url"
      placeholder="https://example.com"
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
