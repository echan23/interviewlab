import React, { useEffect } from "react";
import CodeEditor from "../components/CodeEditor.tsx";
import Output from "../components/Output.tsx";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Header from "../components/Header.tsx";
import { useState, useRef } from "react";
import * as monaco from "monaco-editor";
import {
  handleEditorUpdateEvent,
  updateEditorContentEvent,
} from "../api/events.ts";
import connect, { disconnect } from "../api/websocket.ts";
import type { Edit, Init } from "../data/types.ts";
import { useParams } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider.tsx";
import { useNavigate } from "react-router-dom";

const Room = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  /*The editor useState is at the top level and we use a prop to pass it to CodeEditor. 
  This way, CodeEditor can update the editor value without having to pass it as a prop.
  */

  /*We might have to refactor selectedLanguage, since LanguageSelector is a child of CodeEditor, I had to lift the state twice
  to get it to the top level so that I could pass the selected language to the Output component, it works but is a little messy
  */
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [userCount, setUserCount] = useState(1);
  const socketRef = useRef<WebSocket | null>(null);
  const navigate = useNavigate();

  //Handle updates to the editor
  const handleReceiveEditorUpdate = (receivedEdits: Edit[]) => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }
    updateEditorContentEvent(editor, receivedEdits);
  };

  //Flag to determine when the editor is mounted, we need to mount editor before applying updates
  const [editorMounted, setEditorMounted] = useState(false);
  //Handles retrieval of codefile when the client joins
  const handleReceiveEditorInit = (init: Init) => {
    console.log("init editor content:", init.content);
    const editor = editorRef.current;
    if (!editor) {
      console.error("No editor found");
      return;
    }
    editor.setValue(init.content);

    /*Local update listener that must be attached after the init content is set or else it will interpret the init as a local updates*/
    handleEditorUpdateEvent(editor);
  };
  const { roomID } = useParams();
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
      handleReceiveEditorInit,
      setUserCount,
      navigate
    );
    socketRef.current = socket;
    return () => {
      console.log("cleanup closing socket");
      disconnect();
    };
  }, [roomID, editorMounted]);

  return (
    <ThemeProvider>
      <div className="app-container h-screen w-screen flex flex-col overflow-hidden">
        <Header editorRef={editorRef} userCount={userCount} />

        <div className="code-section-container rounded-lg border border-gray-300 m-2 p-2 ml-2 mr-2">
          <div className="flex-1">
            <PanelGroup direction="horizontal">
              <Panel defaultSize={70} minSize={20}>
                <div className="h-full overflow-auto">
                  <CodeEditor
                    editorRef={editorRef}
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
                  <Output language={selectedLanguage} editorRef={editorRef} />
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
