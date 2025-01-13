import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:8000", {
      transports: ["websocket"],
    });

    socket.current.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    socket.current.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const sendMessage = (event, data) => {
    socket.current.emit(event, data);
  };

  const value = { socket: socket.current, sendMessage };

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};

export const useWebSocket = () => useContext(WebSocketContext);
