"use client";

import { useEffect, useState } from "react";
import MessageInput from "./MessageInput";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { Button } from "@nextui-org/react";
import { useWebSocket } from "../_context/WebSoketContext";
import { useAuth } from "../_context/AuthContext";
import { fetchMessagesByRoom } from "../api/messages";

const ChatBox = ({ room }) => {
  const { user } = useAuth();
  const { socket, sendMessage } = useWebSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await fetchMessagesByRoom(room?.roomId);
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    // Apelează o singură dată la montarea componentului
    loadMessages();
  }, [room]); // Atenție la dependințe

  useEffect(() => {
    if (!socket) return;

    const roomId = room.roomId;

    // Gestionarea mesajelor primite
    socket.onmessage = (event) => {
      const { event: eventType, data } = JSON.parse(event.data);

      if (eventType === "receiveMessage") {
        setMessages((prev) => [...prev, data]);
      }
    };

    // Alătură-te camerei
    sendMessage("joinRoom", { roomId });

    return () => {
      // Lasă camera la deconectare
      sendMessage("leaveRoom", { roomId });
    };
  }, [socket, room.roomId]);

  const handleSendMessage = () => {

    if (!message.trim()) return;

    const messageData = {
      content: message,
      senderId: user._id,
      roomId,
    };

    console.log("message sent", message);

    sendMessage("sendMessage", messageData);
    setMessage("");
  };

  return (
    <div className="flex flex-col p-2 h-full items-center w-full max-w-[600px]">
      <div className="flex-1 w-full  overflow-y-auto">
        {messages?.map((msg, index) => (
          <div
            key={index}
            className={`w-full flex items-center my-2  ${
              msg.senderId === user._id ? "justify-end" : "justify-start"
            }`}
          >
            <p className="rounded-lg p-2 bg-gray-800">{msg.content}</p>
          </div>
        ))}
      </div>

      <div className="flex w-full items-end gap-x-2 ">
        <MessageInput
          message={message}
          setMessage={setMessage}
        />

        <Button
          onPress={handleSendMessage}
          isIconOnly
          variant="ghost"
          color="primary"
          
          className={`h-12 w-12 flex-shrink-0 rounded-[20px] ${!message && "hidden"}`}
        >
          <PaperAirplaneIcon className="size-6  " />
        </Button>
      </div>
    </div>
  );
};

export default ChatBox;
