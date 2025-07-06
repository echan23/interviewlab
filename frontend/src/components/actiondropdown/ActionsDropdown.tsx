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
import HintDialog from "@/components/dialogs/HintDialog";
import { useTheme } from "@/components/ThemeProvider";

const PYTHON_API_URL = import.meta.env.VITE_PYTHON_URL;

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
  const { theme } = useTheme();

  async function handleGenerate() {
    setIsGenerating(true);
    try {
      const res = await fetch(`${PYTHON_API_URL}/generate`, {
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
      const res = await fetch(`${PYTHON_API_URL}/hint`, {
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
            className={`relative h-10 w-10 rounded-lg border transition-all duration-200 group hover:scale-105 ${
              theme === "dark"
                ? `bg-[#2d2d30] border-[#3c3c3c] ${
                    open
                      ? "bg-[#094771] shadow-lg shadow-[#007acc]/20 scale-105"
                      : "hover:bg-[#094771] hover:shadow-lg hover:shadow-[#007acc]/20"
                  }`
                : `bg-[#f3f3f3] border-[#e5e5e5] ${
                    open
                      ? "bg-[#e8f4fd] shadow-md shadow-[#007acc]/10 scale-105"
                      : "hover:bg-[#e8f4fd] hover:shadow-md hover:shadow-[#007acc]/10"
                  }`
            }`}
          >
            <Sparkles
              className={`h-5 w-5 text-purple-400 transition-all duration-200 ${
                open
                  ? "scale-125 text-purple-300"
                  : "group-hover:scale-125 group-hover:text-purple-300"
              }`}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={8}
          className={`w-72 p-4 border shadow-lg rounded-lg ${
            theme === "dark"
              ? "bg-[#252526] border-[#3c3c3c]"
              : "bg-[#f8f8f8] border-[#e5e5e5]"
          }`}
        >
          <div className="space-y-4">
            {/* Generation Section */}
            <div className="space-y-3">
              <DifficultySelector value={difficulty} onChange={setDifficulty} />
              <CompanySelector value={company} onChange={setCompany} />
              <ContentSelector value={topic} onChange={setTopic} />

              <Button
                variant="default"
                className={`w-full h-9 text-sm font-medium rounded-md transition-colors flex items-center justify-center ${
                  theme === "dark"
                    ? "bg-[#2d2d30] hover:bg-[#094771] text-[#cccccc] border border-[#3c3c3c] hover:shadow-md hover:shadow-[#007acc]/20"
                    : "bg-[#f3f3f3] hover:bg-[#e8f4fd] text-[#383a42] border border-[#e5e5e5] hover:shadow-sm hover:shadow-[#007acc]/10"
                }`}
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full mr-2" />
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
            <div
              className={`border-t ${
                theme === "dark" ? "border-[#3c3c3c]" : "border-[#e5e5e5]"
              }`}
            />

            {/* Hints Section */}
            <div className="space-y-2">
              <p
                className={`text-xs font-medium ${
                  theme === "dark" ? "text-[#cccccc]/70" : "text-[#383a42]/70"
                }`}
              >
                Get hints
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex-1 h-9 text-sm font-medium rounded-md transition-colors ${
                    theme === "dark"
                      ? "border-[#3c3c3c] bg-[#2d2d30] hover:bg-[#094771] hover:shadow-md hover:shadow-[#007acc]/20 text-[#cccccc] hover:text-white"
                      : "border-[#e5e5e5] bg-[#f3f3f3] hover:bg-[#e8f4fd] hover:shadow-sm hover:shadow-[#007acc]/10 text-[#383a42]"
                  }`}
                  onClick={() => handleHintClick("weak")}
                  disabled={isHinting}
                >
                  {isHinting ? (
                    <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Weak Hint
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex-1 h-9 text-sm font-medium rounded-md transition-colors ${
                    theme === "dark"
                      ? "border-[#3c3c3c] bg-[#2d2d30] hover:bg-[#094771] hover:shadow-md hover:shadow-[#007acc]/20 text-[#cccccc] hover:text-white"
                      : "border-[#e5e5e5] bg-[#f3f3f3] hover:bg-[#e8f4fd] hover:shadow-sm hover:shadow-[#007acc]/10 text-[#383a42]"
                  }`}
                  onClick={() => handleHintClick("strong")}
                  disabled={isHinting}
                >
                  {isHinting ? (
                    <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Strong Hint
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
