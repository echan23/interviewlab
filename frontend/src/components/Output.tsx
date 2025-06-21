import { executeCode } from "@/api/piston";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"; // shadcn scroll (optional)
import { Play } from "lucide-react";
import { useState } from "react";
import * as monaco from "monaco-editor";

interface OutputProps {
  language: string;
  editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
}

export default function Output({ language, editorRef }: OutputProps) {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const runCode = async () => {
    if (!editorRef.current) return;
    setIsRunning(true);
    try {
      const res = await executeCode(language, editorRef.current.getValue());
      setOutput(res.run.output || "No output");
    } catch {
      setOutput("Error running code");
    } finally {
      setTimeout(() => setIsRunning(false), 800);
    }
  };

  return (
    <div className="flex h-full flex-col gap-3">
      <Button
        onClick={runCode}
        disabled={isRunning}
        className="
    relative self-start rounded-lg px-6 py-3 text-sm font-semibold uppercase text-white shadow-md
    bg-[#22c55e]
    transition-[background-image,background-position,transform] duration-300 ease-in-out
    hover:bg-[linear-gradient(to_right,#22c55e_0%,#60ffa7_51%,#22c55e_100%)]
    hover:bg-[length:200%_auto]
    hover:bg-[position:right_center]
    hover:scale-[1.03]
    active:scale-95
  "
      >
        <Play className="mr-2 h-4 w-4" />
        {isRunning ? "Running…" : "Run"}
      </Button>

      <div className="flex-1 rounded-lg ring-1 ring-border/40 bg-surface/90 drop-shadow-sm">
        <header className="flex items-center justify-between px-4 py-2 text-xs font-medium text-muted-foreground/70">
          Output
        </header>

        <ScrollArea className="h-full">
          <pre className="p-4 font-mono text-sm whitespace-pre-wrap">
            {output}
          </pre>
        </ScrollArea>
      </div>
    </div>
  );
}
