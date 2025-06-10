import React, { useState, useEffect } from "react"
import * as monaco from "monaco-editor"
import Editor from "@monaco-editor/react"
import { editor as MonacoEditor } from "monaco-editor"
import LanguageSelector from "./LanguageSelector"
import languageTemplates from "../data/languageTemplates"
import ThemeToggle from "./ThemeToggle"
import { useTheme } from "./ThemeProvider"

type CodeEditorProps = {
  editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>
  value: string
  onChange: (value: string) => void
  onSelectedLanguage: (value: string) => void
}

const CodeEditor = ({
  editorRef,
  value,
  onChange,
  onSelectedLanguage,
}: CodeEditorProps) => {
  const [currentLanguage, setCurrentLanguage] = useState("python")
  const { theme } = useTheme()

  const handleSelectLanguage = (language: string) => {
    setCurrentLanguage(language)
    onSelectedLanguage(language)
  }

  function handleEditorChange(
    value: string | undefined,
    ev: monaco.editor.IModelContentChangedEvent
  ) {
    if (value !== undefined) {
      onChange(value)
    }
  }

  function getResolvedTheme() {
    if (theme === "dark") return "vs-dark"
    if (theme === "light") return "vs"
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "vs-dark" : "vs"
  }

  function handleEditorDidMount(
    editor: MonacoEditor.IStandaloneCodeEditor,
    monacoInstance: typeof monaco
  ) {
    editorRef.current = editor
    monacoInstance.editor.setTheme(getResolvedTheme())
  }

  useEffect(() => {
    if (!editorRef.current) return

    const applyTheme = () => {
      monaco.editor.setTheme(getResolvedTheme())
    }

    applyTheme()

    if (theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)")
      media.addEventListener("change", applyTheme)
      return () => media.removeEventListener("change", applyTheme)
    }
  }, [theme])

  return (
    <div className="editor-container h-full w-full">
      <div className="mb-2 flex justify-between items-center">
        <LanguageSelector onSelect={handleSelectLanguage} />
        <ThemeToggle />
      </div>
      <Editor
        height="100vh"
        width="100vw"
        defaultLanguage="python"
        language={currentLanguage}
        value={value}
        onChange={handleEditorChange}
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
  )
}

export default CodeEditor
