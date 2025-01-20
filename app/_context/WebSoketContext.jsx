import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [chatSocket, setChatSocket] = useState(null);
  const [groupSocket, setGroupSocket] = useState(null);

  useEffect(() => {
    const chatWs = io("http://localhost:8000/chat");
    const groupWs = io("http://localhost:8000/group");

    chatWs.on("connect", () => {
      console.log("Connected to Chat WebSocket");
    });

    groupWs.on("connect", () => {
      console.log("Connected to Group WebSocket");
    });

    chatWs.on("disconnect", () => {
      console.log("Connected to Chat WebSocket");
    });

    groupWs.on("disconnect", () => {
      console.log("Connected to Group WebSocket");
    });

    setChatSocket(chatWs);
    setGroupSocket(groupWs);

    return () => {
      chatWs.disconnect();
      groupWs.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ chatSocket, groupSocket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
