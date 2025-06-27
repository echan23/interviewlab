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
            variant="ghost"
            className="relative h-10 w-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:scale-105 transition-all duration-200 group"
          >
            <Sparkles className="h-5 w-5 text-purple-600 group-hover:text-purple-700 transition-colors" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={8}
          className="w-72 p-4 border border-gray-200 shadow-lg bg-white rounded-lg"
        >
          <div className="space-y-4">
            {/* Generation Section */}
            <div className="space-y-3">
              <DifficultySelector value={difficulty} onChange={setDifficulty} />
              <CompanySelector value={company} onChange={setCompany} />
              <ContentSelector value={topic} onChange={setTopic} />

              <Button
                variant="default"
                className="w-full h-9 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-md transition-colors"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-3 w-3 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Hints Section */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-medium">Get hints</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-xs font-medium border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 rounded-md transition-colors"
                  onClick={() => handleHintClick("weak")}
                  disabled={isHinting}
                >
                  {isHinting ? (
                    <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <Lightbulb className="h-3 w-3 mr-1" />
                      Weak
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-xs font-medium border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 rounded-md transition-colors"
                  onClick={() => handleHintClick("strong")}
                  disabled={isHinting}
                >
                  {isHinting ? (
                    <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <Lightbulb className="h-3 w-3 mr-1" />
                      Strong
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <HintDialog
        open={hintDialogOpen}
        onOpenChange={setHintDialogOpen}
        title={hintTitle}
        text={hintText}
      />
    </div>
  );
}
