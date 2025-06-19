import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as monaco from "monaco-editor";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import CodeEditor from "../components/CodeEditor";
import Output from "../components/Output";
import Header from "../components/Header";
import { ThemeProvider } from "../components/ThemeProvider";

import {
  handleEditorUpdateEvent,
  updateEditorContentEvent,
} from "../api/events";
import connect, { disconnect } from "../api/websocket";
import type { Edit, Init } from "../data/types";

const Room = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [editorValue, setEditorValue] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [editorMounted, setEditorMounted] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const { roomID } = useParams();

  const handleReceiveEditorUpdate = (receivedEdits: Edit[]) => {
    const editor = editorRef.current;
    if (!editor) return;
    updateEditorContentEvent(editor, receivedEdits);
  };

  const handleReceiveEditorInit = (init: Init) => {
    setEditorValue(init.content);
    const editor = editorRef.current;
    if (!editor) {
      console.error("No editor found");
      return;
    }
    editor.setValue(init.content);
    handleEditorUpdateEvent(editor);
  };

  useEffect(() => {
    if (!roomID) {
      console.error("No roomID in URL, can't start socket");
      return;
    }
    if (!editorMounted) {
      console.log("editor not mounted yet");
      return;
    }

    console.log("Attempting to start socket from Room.tsx");
    const socket = connect(
      roomID,
      handleReceiveEditorUpdate,
      handleReceiveEditorInit
    );
    socketRef.current = socket;

    return () => {
      console.log("cleanup closing socket");
      disconnect();
    };
  }, [roomID, editorMounted]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="app-container h-screen w-screen flex flex-col overflow-hidden pb-4">
        <Header />

        <div className="code-section-container rounded-lg border border-gray-300 m-2 p-1 ml-3 mr-3">
          <div className="flex-1">
            <PanelGroup direction="horizontal">
              <Panel defaultSize={70} minSize={20}>
                <div className="h-full overflow-auto">
                  <CodeEditor
                    editorRef={editorRef}
                    value={editorValue}
                    onChange={(newValue) => setEditorValue(newValue)}
                    onSelectedLanguage={(language) =>
                      setSelectedLanguage(language)
                    }
                    setEditorMounted={setEditorMounted}
                  />
                </div>
              </Panel>
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
    </ThemeProvider>
  );
};

export default Room;
