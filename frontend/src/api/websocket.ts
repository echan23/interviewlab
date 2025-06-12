import * as monaco from "monaco-editor";
import type { Edit, Init } from "../data/types.ts";

let socket: WebSocket;
const connect = (
  onReceiveUpdate: (update: Edit[]) => void, //Callback that handles editor updates
  onReceiveInit: (update: Init) => void //Callback that initializes local editor with codefile content when joining
) => {
  socket = new WebSocket("ws://localhost:8080/ws");
  socket.onopen = () => {
    console.log("socket opened successfully");
  };

  socket.onmessage = (message) => {
    console.log("Received message from websocket:", message.data);
    const raw = JSON.parse(message.data);
    //Note: Edit[] objects don't have a type field
    if (raw.type === "init") {
      onReceiveInit(raw);
    } else {
      onReceiveUpdate(raw);
    }
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
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log(
      "Sending update :" + update,
      "readystate: " + socket.readyState
    );
    socket.send(JSON.stringify(update.changes));
  } else {
    console.error(
      "Wesocket not open: Readystate: " + (socket?.readyState ?? "unddefined")
    );
  }
};

const disconnect = () => {
  if (socket) {
    socket.close();
  }
};

export default connect;
export { sendUpdate, disconnect };
