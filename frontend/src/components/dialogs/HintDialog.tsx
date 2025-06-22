import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type HintDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  text: string;
};

export default function HintDialog({
  open,
  onOpenChange,
  title,
  text,
}: HintDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <span></span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="whitespace-pre-wrap">
            {text}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
