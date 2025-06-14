import React from "react";
import { useState, useRef } from "react";
import * as monaco from "monaco-editor";
import Editor from "@monaco-editor/react";
import { editor as MonacoEditor } from "monaco-editor";
import LanguageSelector from "./LanguageSelector";

type CodeEditorProps = {
  editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
  value: string;
  onSelectedLanguage: (value: string) => void;
  setEditorMounted(value: boolean): void;
};

const CodeEditor = ({
  editorRef,
  value,
  onSelectedLanguage,
  setEditorMounted,
}: CodeEditorProps) => {
  const [currentLanguage, setCurrentLanguage] = useState("python");

  /*Placeholders when switching languages, work in progress
  const [placeholder, setPlaceholder] = useState<{
    [key: string]: string;
  }>({
    python: languageTemplates["python"],
    java: languageTemplates["java"],
    c: languageTemplates["c"],
    cpp: languageTemplates["cpp"],
    javascript: languageTemplates["javascript"],
  });*/

  const handleSelectLanguage = (language: string) => {
    setCurrentLanguage(language);
    onSelectedLanguage(language);
  };

  function handleEditorDidMount(
    editor: MonacoEditor.IStandaloneCodeEditor,
    monacoInstance: typeof monaco
  ) {
    editorRef.current = editor;
    monacoInstance.editor.defineTheme("no-border-highlight", {
      base: "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.lineHighlightBackground": "#f5f5f5",
        "editor.lineHighlightBorder": "#00000000",
      },
    });
    monacoInstance.editor.setTheme("no-border-highlight");
    setEditorMounted(true); //Trigger flag that editor is mounted, allows frontend to begin conncecting
  }

  function handleEditorBeforeMount(monacoInstance: typeof monaco) {}

  function handleEditorValidation(markers: monaco.editor.IMarker[]) {
    // model markers
    // markers.forEach(marker => console.log('onValidate:', marker.message));
  }

  return (
    <div className="editor-container h-full w-full">
      <div className="mb-2">
        <LanguageSelector onSelect={handleSelectLanguage} />
      </div>
      <Editor
        height="84vh"
        width="100vw"
        defaultLanguage="python"
        language={currentLanguage}
        value={value}
        onMount={handleEditorDidMount}
        beforeMount={handleEditorBeforeMount}
        onValidate={handleEditorValidation}
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
