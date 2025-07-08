import { Button } from "../../shadcn/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../../shadcn/components/ui/sheet";

type Props = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  content: React.ReactNode;
  onClose?: () => void;
  onSave?: () => void;
  open: boolean;
  submitLabel?: string;
  cancelLabel?: string;
};

export default function AppDrawer(props: Props) {
  const {
    title,
    description,
    content,
    onClose,
    onSave,
    open,
    submitLabel,
    cancelLabel,
  } = props;

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose?.()}>
      <SheetContent className="w-[600px] !max-w-3xl">
        {title || description ? (
          <SheetHeader className="sticky top-0 bg-background">
            {title && <SheetTitle>{title}</SheetTitle>}
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
        ) : null}
        <div className="overflow-auto">{content}</div>
        <SheetFooter className="sticky bottom-0 bg-background">
          <div className="flex justify-end">
            {onSave ? (
              <Button type="submit" onClick={onSave}>
                {submitLabel || "Save"}
              </Button>
            ) : null}
            {onClose ? (
              <Button variant="outline" onClick={onClose} className="ml-2">
                {cancelLabel || "Cancel"}
              </Button>
            ) : null}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
