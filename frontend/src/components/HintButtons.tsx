import { Button } from "@/components/ui/button";

export default function HintButtons() {
  return (
    <div className="flex gap-2">
      <Button variant="default">Weak Hint</Button>
      <Button variant="default">Strong Hint</Button>
    </div>
  );
}
