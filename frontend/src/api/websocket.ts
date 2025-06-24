import * as monaco from "monaco-editor";
import type { Edit, Init } from "../data/types.ts";
import type { Params } from "react-router-dom";
import { useNavigate } from "react-router-dom";

let socket: WebSocket;
const connect = (
  roomID: string,
  onReceiveUpdate: (update: Edit[]) => void, //Callback that handles editor updates from other clients
  onReceiveInit: (update: Init) => void, //Callback that initializes local editor with codefile content when joining
  setUserCount: (count: number) => void,
  navigate: ReturnType<typeof useNavigate>
) => {
  socket = new WebSocket(`ws://localhost:8080/ws/${roomID}`);
  socket.onopen = () => {
    console.log("socket opened successfully");
  };

  socket.onmessage = (message) => {
    console.log("Received message from websocket:", message.data);
    const raw = JSON.parse(message.data);
    //Note: Edit[] objects don't have a type field
    if (raw.type === "init") {
      onReceiveInit(raw);
    } else if (raw.type == "userCountUpdate") {
      console.log("received usercount update");
      setUserCount(raw.count);
    } else {
      onReceiveUpdate(raw);
    }
  };
  socket.onclose = (event) => {
    console.log("Socket connection closing");
    if (event.code === 1006) {
      console.log("Socket closed by server");
      navigate("/", { replace: true });
    }
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
