import { executeCode } from "@/api/piston";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import * as monaco from "monaco-editor";

interface OutputProps {
  language: string;
  editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
}

const Output = ({ language, editorRef }: OutputProps) => {
  const [output, setOutput] = useState("");
  const runCode = async () => {
    if (!editorRef.current) return;
    const editorContent = editorRef.current.getValue();
    try {
      const response = await executeCode(language, editorContent);
      setOutput(response.run.output || "No output");
    } catch (error) {
      setOutput("error running code");
    }
  };

  return (
    <div className="output-container flex flex-col h-full">
      <div className="w-fit">
        <Button variant="outline" className="mb-2" onClick={runCode}>
          Run
        </Button>
      </div>

      <div className="flex-1 bg-muted text-muted-foreground p-4 rounded-md font-mono text-sm whitespace-pre-wrap overflow-auto">
        <span className="font-semibold">Output</span>
        <br />
        <br />
        {output}
      </div>
    </div>
  );
};

export default Output;
