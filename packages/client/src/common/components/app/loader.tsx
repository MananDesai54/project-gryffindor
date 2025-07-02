import { Loader2Icon } from "lucide-react";

type Props = {
  className?: string;
  size?: number | string;
  message?: string;
};

export default function Loader(props: Props) {
  return (
    <div className={`loader ${props.className || ""}`}>
      <div className="flex flex-col items-center">
        <Loader2Icon className="animate-spin" size={props.size || 32} />
        {props.message ? (
          <p className="text-center mt-2">{props.message}</p>
        ) : null}
      </div>
    </div>
  );
}
