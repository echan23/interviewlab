import React from "react";
import { useState, useRef, useEffect } from "react";
import * as monaco from "monaco-editor";
import Editor from "@monaco-editor/react";
import { editor as MonacoEditor } from "monaco-editor";
import LanguageSelector from "./LanguageSelector";
import languageTemplates from "../data/languageTemplates";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "next-themes";

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
    if (theme === "dark") return "vs-dark";
    if (theme === "light") return "vs";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "vs-dark"
      : "vs";
  }

  function handleEditorDidMount(
    editor: MonacoEditor.IStandaloneCodeEditor,
    monacoInstance: typeof monaco
  ) {
    editorRef.current = editor;
    monacoInstance.editor.setTheme(getResolvedTheme());
    setEditorMounted(true);
  }

  useEffect(() => {
    if (!editorRef.current) return;

    const applyTheme = () => {
      monaco.editor.setTheme(getResolvedTheme());
    };

    applyTheme();

    if (theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      media.addEventListener("change", applyTheme);
      return () => media.removeEventListener("change", applyTheme);
    }
  }, [theme]);

  return (
    <div className="editor-container h-full w-full">
      <div className="mb-2 flex justify-between items-center">
        <LanguageSelector onSelect={handleSelectLanguage} />
        <ThemeToggle />
      </div>
      <Editor
        height="84vh"
        width="100vw"
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
  );
};

export default CodeEditor;
