import * as monaco from "monaco-editor";

let socket: WebSocket;
const connect = (onReceiveUpdate: (update: string) => void) => {
  socket = new WebSocket("ws://localhost:8080");
  socket.onopen = () => {
    console.log("socket opened successfully");
  };

  socket.onmessage = (message) => {
    console.log(message.data);
    onReceiveUpdate(message.data);
  };

  socket.onclose = () => {
    console.log("Socket connection closing");
  };

  socket.onerror = (error) => {
    console.log("Error:", error);
  };

  return socket;
};

//Convert update object to json
const sendUpdate = (update: monaco.editor.IModelContentChangedEvent) => {
  socket.send(JSON.stringify(update));
};

export default connect;
