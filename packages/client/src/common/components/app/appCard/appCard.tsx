import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../shadcn/components/ui/card";

type Props = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  cardAction?: React.ReactNode;
};

export default function AppCard({
  title,
  description,
  content,
  footer,
  className,
  cardAction,
}: Props) {
  return (
    <Card className={className}>
      {title || description ? (
        <CardHeader>
          {title ? <CardTitle>{title}</CardTitle> : null}
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
          {cardAction ? <CardAction>{cardAction}</CardAction> : null}
        </CardHeader>
      ) : null}
      {content ? <CardContent>{content}</CardContent> : null}
      {footer ? <CardFooter>{footer}</CardFooter> : null}
    </Card>
  );
}
