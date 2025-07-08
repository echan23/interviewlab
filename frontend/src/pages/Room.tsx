import { useEffect } from "react";
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
import { ThemeProvider, useTheme } from "@/components/ThemeProvider.tsx";
import { useNavigate } from "react-router-dom";

const RoomContent = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [userCount, setUserCount] = useState(1);
  const socketRef = useRef<WebSocket | null>(null);
  const navigate = useNavigate();
  const { theme } = useTheme();

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
    <div
      className={`app-container h-screen w-screen flex flex-col overflow-hidden ${
        theme === "dark" ? "bg-[#1e1e1e]" : "bg-white"
      }`}
    >
      <Header editorRef={editorRef} userCount={userCount} />

      <div
        className={`code-section-container rounded-lg border p-2 ml-2 mr-2 transition-colors duration-200 ${
          theme === "dark"
            ? "border-[#3c3c3c] bg-[#252526] shadow-xl shadow-black/20"
            : "border-[#e5e5e5] bg-[#f8f8f8] shadow-lg"
        }`}
      >
        <div className="flex-1">
          <PanelGroup direction="horizontal">
            <Panel defaultSize={70} minSize={20}>
              <div className="h-full overflow-auto ">
                <CodeEditor
                  editorRef={editorRef}
                  onSelectedLanguage={(language) =>
                    setSelectedLanguage(language)
                  }
                  setEditorMounted={setEditorMounted}
                />
              </div>
            </Panel>
            <PanelResizeHandle
              className={`w-1 cursor-col-resize transition-colors duration-150 ml-1 mr-1 ${
                theme === "dark"
                  ? "bg-[#3c3c3c] hover:bg-[#007acc]"
                  : "bg-[#e5e5e5] hover:bg-[#007acc]"
              }`}
            />
            <Panel defaultSize={30} minSize={20}>
              <div className="output-container-wrapper h-full overflow-auto flex flex-col justify-end">
                <Output language={selectedLanguage} editorRef={editorRef} />
              </div>
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </div>
  );
};

const Room = () => {
  return (
    <ThemeProvider>
      <RoomContent />
    </ThemeProvider>
  );
};

export default Room;
