import * as monaco from "monaco-editor";
import { sendUpdate } from "./websocket";
import type { Edit, Init } from "../data/types";

let applyingRemote = false;

const MAX_LINES = 100;

const handleEditorUpdateEvent = (
  editor: monaco.editor.IStandaloneCodeEditor
) => {
  console.log("attaching listener");

  const model = editor.getModel();
  if (!model) return;

  let lastValidValue = model.getValue();

  model.onDidChangeContent((event: monaco.editor.IModelContentChangedEvent) => {
    if (applyingRemote) return;

    const lineCount = model.getLineCount();
    // Revert the user's last change if over the limit
    if (lineCount > MAX_LINES) {
      editor.executeEdits("", [
        {
          range: model.getFullModelRange(),
          text: lastValidValue,
        },
      ]);
      editor.pushUndoStop();
      console.warn(`Max line count of ${MAX_LINES} reached. Edit reverted.`);
      return;
    }
    // Update last valid value if still within limit
    lastValidValue = model.getValue();
    sendUpdate(event);
  });
};

const updateEditorContentEvent = (
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

export { handleEditorUpdateEvent, updateEditorContentEvent };
