import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../shadcn/components/ui/card";

type Props = {
  title?: React.ReactNode;
  content: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export default function AppCard({ title, content, footer, className }: Props) {
  return (
    <Card className={className}>
      {title ? <CardHeader>{title}</CardHeader> : null}
      <CardContent>{content}</CardContent>
      {footer ? <CardFooter>{footer}</CardFooter> : null}
    </Card>
  );
}
