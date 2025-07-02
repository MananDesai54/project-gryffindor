import { WandSparkles } from "lucide-react";
import { Button } from "../shadcn/components/ui/button";
import { Input } from "../shadcn/components/ui/input";
import { useCallback, useState } from "react";
import classNames from "classnames";
import { useGenerateTextMutation } from "../../api/serverQueries/agent/useInferenceMutation";

type Props = {
  placeholder?: string;
  onGenerate: (text: string) => void;
  inputClassName?: string;
  className?: string;
};

export default function GenerateTextWithAi(props: Props) {
  const { placeholder, onGenerate, inputClassName, className } = props;

  const [prompt, setPrompt] = useState("");

  const { mutateAsync, isPending } = useGenerateTextMutation();

  const generateText = useCallback(async () => {
    const generatedText = await mutateAsync({ text: prompt });
    setPrompt("");
    onGenerate(generatedText);
  }, [mutateAsync, onGenerate, prompt]);

  return (
    <div className={classNames("flex items-center w-full", className)}>
      <Input
        placeholder={placeholder}
        className={inputClassName}
        disabled={isPending}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <Button
        variant="outline"
        onClick={generateText}
        className="ml-2"
        disabled={isPending}
      >
        <WandSparkles />
      </Button>
    </div>
  );
}
