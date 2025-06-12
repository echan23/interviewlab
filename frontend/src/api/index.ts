import * as monaco from "monaco-editor";
import { sendUpdate } from "./websocket";
import type { Edit } from "../data/types";

let applyingRemote = false;

const handleEditorUpdate = (editor: monaco.editor.IStandaloneCodeEditor) => {
  console.log("attaching listener");
  const model = editor.getModel();

  if (!model) return;

  model.onDidChangeContent((event: monaco.editor.IModelContentChangedEvent) => {
    if (applyingRemote) return;
    console.log("onDidChangeModelContent:", event);
    sendUpdate(event);
  });
};

const updateEditorContent = (
  editor: monaco.editor.IStandaloneCodeEditor,
  edits: Edit[]
) => {
  applyingRemote = true;
  const editOperations = edits.map((e) => ({
    range: new monaco.Range(
      e.range.startLineNumber,
      e.range.startColumn,
      e.range.endLineNumber,
      e.range.endColumn
    ),
    text: e.text,
    forceMoveMarkers: true,
  }));

  editor.executeEdits("remote", editOperations);
  applyingRemote = false;
};

export { handleEditorUpdate, updateEditorContent };
