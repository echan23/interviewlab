import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type QuestionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: string;
  onRegenerate: () => void;
};

export default function QuestionDialog({
  open,
  onOpenChange,
  question,
  onRegenerate,
}: QuestionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <span></span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generated Question</DialogTitle>
          <DialogDescription className="whitespace-pre-wrap">
            {question}
          </DialogDescription>
        </DialogHeader>
        <Button onClick={onRegenerate} className="mt-4">
          Regenerate
        </Button>
      </DialogContent>
    </Dialog>
  );
}
