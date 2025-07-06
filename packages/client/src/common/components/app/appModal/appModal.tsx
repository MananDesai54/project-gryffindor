import { Button } from "../../shadcn/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../shadcn/components/ui/dialog";

type Props = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  content: React.ReactNode;
  onClose?: () => void;
  onSave?: () => void;
  open: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  saveDisabled?: boolean;
};

export default function AppModal(props: Props) {
  const {
    title,
    description,
    content,
    onClose,
    onSave,
    open,
    submitLabel,
    cancelLabel,
    saveDisabled,
  } = props;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose?.()}>
      <DialogContent>
        <DialogHeader>
          {title ? <DialogTitle>{title}</DialogTitle> : null}
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        {content}
        {onClose || onSave ? (
          <DialogFooter>
            {onClose ? (
              <DialogClose>
                <Button variant="outline" onClick={onClose}>
                  {cancelLabel || "Cancel"}
                </Button>
              </DialogClose>
            ) : null}
            {onSave ? (
              <Button type="submit" onClick={onSave} disabled={saveDisabled}>
                {submitLabel || "Save"}
              </Button>
            ) : null}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
