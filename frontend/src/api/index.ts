import * as monaco from "monaco-editor";

const handleEditorUpdate = (editor: monaco.editor.IStandaloneCodeEditor) => {
  const model = editor.getModel();

  if (!model) return;

  model.onDidChangeContent((event: monaco.editor.IModelContentChangedEvent) => {
    console.log("onDidChangeModelContent:", event.changes);
  });
};

export { handleEditorUpdate };
