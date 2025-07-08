import React from "react";
import { useState, useEffect } from "react";
import * as monaco from "monaco-editor";
import Editor from "@monaco-editor/react";
import { editor as MonacoEditor } from "monaco-editor";
import LanguageSelector from "./LanguageSelector";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";

type CodeEditorProps = {
  editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
  onSelectedLanguage: (value: string) => void;
  setEditorMounted: (value: boolean) => void;
};

const CodeEditor = ({
  editorRef,
  onSelectedLanguage,
  setEditorMounted,
}: CodeEditorProps) => {
  const [currentLanguage, setCurrentLanguage] = useState("python");
  const { theme } = useTheme();

  const handleSelectLanguage = (language: string) => {
    setCurrentLanguage(language);
    onSelectedLanguage(language);
  };

  function getResolvedTheme() {
    return theme === "dark" ? "vs-dark" : "vs";
  }

  function handleEditorDidMount(
    editor: MonacoEditor.IStandaloneCodeEditor,
    monacoInstance: typeof monaco
  ) {
    editorRef.current = editor;
    monacoInstance.editor.setTheme(getResolvedTheme());
    setEditorMounted(true);
  }

  // UseEffect for theme change
  useEffect(() => {
    if (!editorRef.current) return;
    monaco.editor.setTheme(getResolvedTheme());
  }, [theme]);

  return (
    <div
      className={`editor-container h-full w-full ${
        theme === "dark" ? "bg-[#1e1e1e]" : "bg-white"
      }`}
    >
      <div
        className={`mb-2 flex justify-between items-center ${
          theme === "dark" ? "bg-[#252526]" : "bg-[#f8f8f8]"
        }`}
      >
        <LanguageSelector onSelect={handleSelectLanguage} />
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
      <div>
        <Editor
          height="calc(84vh - 1rem)"
          width="100%"
          defaultLanguage="python"
          language={currentLanguage}
          onMount={handleEditorDidMount}
          theme={getResolvedTheme()}
          options={{
            minimap: { enabled: false },
            wordWrap: "on",
            renderLineHighlight: "line",
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
