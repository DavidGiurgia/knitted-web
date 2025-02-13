"use client";

import { useEffect, useState } from "react";
import MessageInput from "../../MessageInput";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { Button } from "@heroui/react";
import { useWebSocket } from "../../../_context/WebSoketContext";
import { useAuth } from "../../../_context/AuthContext";
import { fetchMessagesByRoom } from "../../../api/messages";
import { getUserById } from "../../../services/userService";
import PrivateMessagesItem from "./PrivateMessagesItem";
import { useKeyboard } from "@/app/_context/KeyboardContext";

const ChatBox = ({ room }) => {
  const { user } = useAuth();
  const [participants, setParticipants] = useState();
  const { chatSocket } = useWebSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { isKeyboardOpen, keyboardHeight } = useKeyboard();

  useEffect(() => {
    const loadMessagesAndParticipants = async () => {
      try {
        const data = await fetchMessagesByRoom(room._id);
        setMessages(data);

        if (!room.participants) return;

        const participantPromises = room.participants.map(
          async (participantId) => {
            const user = await getUserById(participantId);
            return user;
          }
        );

        const participantsData = await Promise.all(participantPromises);
        setParticipants(participantsData);
      } catch (error) {
        console.error("Failed to fetch messages or participants:", error);
      }

      chatSocket.emit("joinRoom", { roomId: room._id });
      console.log("Joining room", room._id);
    };

    if (room) {
      loadMessagesAndParticipants();
    }
    return () => {
      chatSocket?.emit("leaveRoom", { roomId: room?._id });
      console.log("Leaving room", room?._id);
    };
  }, [room, chatSocket]); // Atenție la dependințe

  useEffect(() => {
    if (!chatSocket) return;

    const handleMessageReceived = (newMessage) => {
      console.log("Received message:", newMessage);
      setMessages((prev) => [...prev, newMessage]);
    };

    chatSocket.on("receiveMessage", handleMessageReceived);

    return () => {
      chatSocket.off("receiveMessage", handleMessageReceived);
    };
  }, [chatSocket]); // Atenție la dependințe

  const handleSendMessage = () => {
    if (!message.trim() || !chatSocket) return;

    if (message.length > 500) {
      toast.error("Message is too long. Maximum length is 500 characters.");
      return;
    }

    console.log(message);

    const messageData = {
      roomId: room._id,
      senderId: user._id,
      senderName: user.fullname,
      content: message,
      isAnonymous: false,
    };

    chatSocket.emit("sendMessage", messageData);

    setMessage("");
  };

  return (
    <div className="p-2 w-full flex flex-col h-full overflow-hidden max-h-full">
      <PrivateMessagesItem
        room={room}
        messages={messages}
        participant={user}
        participants={participants}
      />
      <MessageInput
        anonymousMode={false}
        senderName={user?.nickname}
        message={message}
        setMessage={setMessage}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ChatBox;
