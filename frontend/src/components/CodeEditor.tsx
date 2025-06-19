import React, { useState, useEffect } from "react"
import * as monaco from "monaco-editor"
import Editor from "@monaco-editor/react"
import { editor as MonacoEditor } from "monaco-editor"
import LanguageSelector from "./LanguageSelector"
import languageTemplates from "../data/languageTemplates"
import ThemeToggle from "./ThemeToggle"
import DifficultySelector from "./DifficultySelector";
import { useTheme } from "./ThemeProvider"
import HintButtons from "./HintButtons"
import GeneratePopover from "./GeneratePopover"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import CompanySelector from "./CompanySelector"
import { Button } from "./ui/button"
import ContentSelector from "./ContentSelector"

type CodeEditorProps = {
  editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>
  value: string
  onChange: (value: string) => void
  onSelectedLanguage: (value: string) => void
  setEditorMounted: React.Dispatch<React.SetStateAction<boolean>>;
}

const CodeEditor = ({
  editorRef,
  value,
  onChange,
  onSelectedLanguage,
  setEditorMounted,
}: CodeEditorProps) => {
  const [currentLanguage, setCurrentLanguage] = useState("python")
  const { theme } = useTheme()
  const [difficulty, setDifficulty] = useState("easy");
  const [selectedCompany, setSelectedCompany] = useState(" ")
  const [selectedTopic, setSelectedTopic] = useState(" ")

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
    return theme === "dark" ? "vs-dark" : "vs"
  }

  function handleEditorDidMount(
    editor: MonacoEditor.IStandaloneCodeEditor,
    monacoInstance: typeof monaco
  ) {
    editorRef.current = editor
    monacoInstance.editor.setTheme(getResolvedTheme())
    setEditorMounted(true)
  }

  useEffect(() => {
    if (!editorRef.current) return
    monaco.editor.setTheme(getResolvedTheme())
  }, [theme])

  return (
    <div className="editor-container h-full w-full">
      <div className="mb-2 flex justify-between items-center">
        <LanguageSelector onSelect={handleSelectLanguage} />
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger>
              <Button variant="outline">Generate</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="space-y-4">
                <DifficultySelector value={difficulty} onChange={setDifficulty} />
                <CompanySelector value={selectedCompany} onChange={setSelectedCompany} />
                <ContentSelector value={selectedTopic} onChange={setSelectedTopic} />
                <Button variant="outline">Generate Question</Button>
              </div>
            </PopoverContent>
          </Popover>
          <HintButtons />
          <ThemeToggle />
        </div>
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
