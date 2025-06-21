import { useState } from "react";
import { Button } from "@/components/ui/button";
import * as monaco from "monaco-editor";
import type { MutableRefObject } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type HintButtonsProps = {
  editorRef: MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
};

export default function HintButtons({ editorRef }: HintButtonsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hintText, setHintText] = useState("");
  const [hintTitle, setHintTitle] = useState("");

  async function handleHintClick(hintType: "weak" | "strong") {
    const code = editorRef.current?.getValue() || "";

    if (!code.trim()) {
      alert("Please enter some code first.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, hintType }),
      });

      const data = await res.json();

      if (data.hint) {
        setHintTitle(hintType === "weak" ? "Weak Hint" : "Strong Hint");
        setHintText(data.hint);
        setDialogOpen(true);
      } else {
        alert("Failed to retrieve hint.");
      }
    } catch (error) {
      console.error("Hint request failed:", error);
      alert("Error connecting to the server.");
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <Button onClick={() => handleHintClick("weak")}>Weak Hint</Button>
        <Button onClick={() => handleHintClick("strong")}>Strong Hint</Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          {/* Dummy trigger so Dialog works */}
          <span></span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{hintTitle}</DialogTitle>
            <DialogDescription className="whitespace-pre-wrap">
              {hintText}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
