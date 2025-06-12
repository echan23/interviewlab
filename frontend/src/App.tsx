import React, { useEffect } from "react";
import CodeEditor from "./components/CodeEditor";
import Output from "./components/Output";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Header from "./components/Header";
import { useState, useRef } from "react";
import * as monaco from "monaco-editor";
import { handleEditorUpdate, updateEditorContent } from "./api/index.ts";
import connect, { disconnect } from "./api/websocket.ts";
import type { Edit, Init } from "./data/types.ts";

function App() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  /*The editor useState is at the top level and we use a prop to pass it to CodeEditor. 
  This way, CodeEditor can update the editor value without having to pass it as a prop.
  Another option is to pass the editor value as a prop and update it in the CodeEditor component,
  but this is bad practice because you don't want to use the editor for state management.
  */
  const [editorValue, setEditorValue] = useState("");

  /*We might have to refactor selectedLanguage, since LanguageSelector is a child of CodeEditor, I had to lift the state twice
  to get it to the top level so that I could pass the selected language to the Output component, it works but is a little messy
  */
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const socketRef = useRef<WebSocket | null>(null);

  //Handle updates to the editor
  const handleReceiveEditorUpdate = (receivedEdits: Edit[]) => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }
    updateEditorContent(editor, receivedEdits);
  };
  //Handles retrieval of codefile when the client joins
  const handleReceiveEditorInit = (init: Init) => {
    console.log("init editor content:", init.content);
    setEditorValue(init.content);
    const editor = editorRef.current;
    if (!editor) {
      return;
    }
    editor.setValue(init.content);
  };

  useEffect(() => {
    const socket = connect(handleReceiveEditorUpdate, handleReceiveEditorInit);
    socketRef.current = socket;

    /*const editor = editorRef.current;
    if (editor) {
      handleEditorUpdate(editor);
    }*/

    return () => {
      console.log("cleanup closing socket");
      disconnect();
    };
  }, []);

  return (
    <div className="app-container h-screen w-screen flex flex-col overflow-hidden">
      <Header />

      <div className="code-section-container rounded-lg border border-gray-300 m-1 p-1">
        <div className="flex-1">
          <PanelGroup direction="horizontal">
            <Panel defaultSize={70} minSize={20}>
              <div className="h-full overflow-auto">
                <CodeEditor
                  editorRef={editorRef}
                  value={editorValue}
                  onSelectedLanguage={(language) =>
                    setSelectedLanguage(language)
                  }
                />
              </div>
            </Panel>
            {/* Resizable Divider */}
            <PanelResizeHandle className="w-1 bg-gray-400 hover:bg-gray-600 cursor-col-resize transition-colors duration-150 ml-1 mr-1" />
            <Panel defaultSize={30} minSize={20}>
              <div className="output-container-wrapper h-full overflow-auto flex flex-col justify-end">
                <Output language={selectedLanguage} input={editorValue} />
              </div>
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </div>
  );
}

export default App;
