"use client";

import * as React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import DifficultySelector from "./DifficultySelector";
import CompanySelector from "./CompanySelector";
import ContentSelector from "../ContentSelector";
import { Sparkles, Wand2, Lightbulb } from "lucide-react";
import { useState } from "react";
import * as monaco from "monaco-editor";
import { updateEditorContentEvent } from "@/api/events";
import type { Edit } from "@/data/types";
import HintDialog from "@/components/dialogs/HintDialog";

type ActionsDropdownProps = {
  editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
};

export default function ActionsDropdown({ editorRef }: ActionsDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [difficulty, setDifficulty] = React.useState("easy");
  const [company, setCompany] = React.useState(" ");
  const [topic, setTopic] = React.useState(" ");
  const [hintDialogOpen, setHintDialogOpen] = useState(false);
  const [hintText, setHintText] = useState("");
  const [hintTitle, setHintTitle] = useState("");
  //const [questionContent, setQuestionContent] = useState("");
  //const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isHinting, setIsHinting] = useState(false);

  async function handleGenerate() {
    setIsGenerating(true);
    try {
      const res = await fetch("http://localhost:8000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ difficulty, company, topic }),
      });
      const data = await res.json();
      if (data.question) {
        const content = formatComment(data.question);
        const editor = editorRef.current;
        const model = editor?.getModel();

        if (editor && model) {
          const fullRange = model.getFullModelRange();

          const editOperation: monaco.editor.IIdentifiedSingleEditOperation = {
            range: fullRange,
            text: content,
            forceMoveMarkers: true,
          };

          editor.executeEdits("generate-question", [editOperation]);
          editor.pushUndoStop();
        }
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to server");
    } finally {
      setTimeout(() => setIsGenerating(false), 2000);
      setOpen(false);
    }
  }

  const formatComment = (content: string): string => {
    const language =
      editorRef.current?.getModel()?.getLanguageId() ?? "plaintext";

    if (["python"].includes(language)) {
      return `"""\n${content}\n"""`;
    }

    if (["java", "c", "cpp", "javascript", "typescript"].includes(language)) {
      return `/*\n${content}\n*/`;
    }

    return content
      .split("\n")
      .map((line) => `// ${line}`)
      .join("\n");
  };

  async function handleHintClick(hintType: "weak" | "strong") {
    const code = editorRef.current?.getValue() || "";

    if (!code.trim()) {
      alert("Please enter some code first.");
      return;
    }

    setIsHinting(true);
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
        setHintDialogOpen(true);
      } else {
        alert("Failed to retrieve hint.");
      }
    } catch (error) {
      console.error("Hint request failed:", error);
      alert("Error connecting to the server.");
    } finally {
      setTimeout(() => setIsHinting(false), 2000);
      setOpen(false);
    }
  }

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="secondary"
            className="h-12 w-12 rounded-lg shadow-md p-0 hover:scale-105 transition-transform"
          >
            <Sparkles className="h-7 w-7" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" sideOffset={8} className="w-64 space-y-4">
          <div className="space-y-3">
            <DifficultySelector value={difficulty} onChange={setDifficulty} />
            <CompanySelector value={company} onChange={setCompany} />
            <ContentSelector value={topic} onChange={setTopic} />
            <Button
              variant="default"
              className="w-full flex items-center gap-2"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
              Generate
            </Button>
          </div>
          <div className="flex gap-2 pt-3 border-t">
            <Button
              variant="outline"
              className="flex-1 flex items-center gap-1"
              onClick={() => handleHintClick("weak")}
              disabled={isHinting}
            >
              {isHinting ? (
                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
              ) : (
                <Lightbulb className="h-4 w-4" />
              )}
              Weak
            </Button>
            <Button
              variant="outline"
              className="flex-1 flex items-center gap-1"
              onClick={() => handleHintClick("strong")}
              disabled={isHinting}
            >
              {isHinting ? (
                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
              ) : (
                <Lightbulb className="h-4 w-4" />
              )}
              Strong
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <HintDialog
        open={hintDialogOpen}
        onOpenChange={setHintDialogOpen}
        title={hintTitle}
        text={hintText}
      ></HintDialog>
    </div>
  );
}
