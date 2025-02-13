import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [chatSocket, setChatSocket] = useState(null);

  useEffect(() => {
    const chatWs = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`);

    chatWs.on("connect", () => {
      console.log("Connected to Chat WebSocket");
    });

    chatWs.on("disconnect", () => {
      console.log("Connected to Chat WebSocket");
    });

    setChatSocket(chatWs);

    return () => {
      chatWs.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ chatSocket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
