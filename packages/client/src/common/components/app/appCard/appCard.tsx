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
  headerClassName?: string;
  footerClassName?: string;
  contentClassName?: string;
};

export default function AppCard({
  title,
  description,
  content,
  footer,
  className,
  cardAction,
  headerClassName,
  footerClassName,
  contentClassName,
}: Props) {
  return (
    <Card className={className}>
      {title || description ? (
        <CardHeader className={headerClassName}>
          {title ? <CardTitle>{title}</CardTitle> : null}
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
          {cardAction ? <CardAction>{cardAction}</CardAction> : null}
        </CardHeader>
      ) : null}
      {content ? (
        <CardContent className={contentClassName}>{content}</CardContent>
      ) : null}
      {footer ? (
        <CardFooter className={footerClassName}>{footer}</CardFooter>
      ) : null}
    </Card>
  );
}
