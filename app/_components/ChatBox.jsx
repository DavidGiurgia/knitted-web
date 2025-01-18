"use client";

import { useEffect, useState } from "react";
import MessageInput from "./MessageInput";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { Avatar, Button } from "@nextui-org/react";
import { useWebSocket } from "../_context/WebSoketContext";
import { useAuth } from "../_context/AuthContext";
import { fetchMessagesByRoom } from "../api/messages";
import { formatTimeFromTimestamp } from "../services/utils";
import { getUserById } from "../services/userService";

const ChatBox = ({ room }) => {
  const { user } = useAuth();
  const [participants, setParticipants] = useState();
  const { chatSocket } = useWebSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  let roomId = room?._id;

  useEffect(() => {
    const loadMessagesAndParticipants = async () => {
      try {
        roomId = room._id; // Asigură-te că room este definit înainte de accesare
        const data = await fetchMessagesByRoom(roomId);
        setMessages(data);

        // Transformă participant IDs în obiecte folosind getUserById
        const participantPromises = room.participants.map(
          async (participantId) => {
            const user = await getUserById(participantId);
            return user;
          }
        );

        // Așteaptă toate cererile asincrone
        const participantsData = await Promise.all(participantPromises);
        setParticipants(participantsData);
      } catch (error) {
        console.error("Failed to fetch messages or participants:", error);
      }
    };

    console.log("room id here -> ", roomId);
    // Apelează o singură dată la montarea componentului
    if (room) {
      loadMessagesAndParticipants();
    }
  }, [roomId]); // Atenție la dependințe

  useEffect(() => {
    if (!chatSocket || !roomId) {
      console.log(
        "Failed to connect. chatSocket is null or empty.",
        chatSocket,
        roomId
      );
      return;
    }

    chatSocket.emit("joinRoom", { roomId });

    // Ascultă mesaje
    const handleMessageReceived = (newMessage) => {
      console.log("Received message:", newMessage);
      setMessages((prev) => [...prev, newMessage]);
    };

    // Adaugă evenimentul
    chatSocket.on("receiveMessage", handleMessageReceived);

    // Curăță evenimentul la demontare
    return () => {
      chatSocket.off("receiveMessage", handleMessageReceived);
      chatSocket.emit("leaveRoom", { roomId });
    };
  }, [chatSocket, roomId]); // Atenție la dependințe

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const messageData = {
      content: message,
      senderId: user._id,
      roomId: roomId,
      isAnonymous: false,
    };

    chatSocket.emit("sendMessage", messageData);

    console.log("message sent", messageData);

    setMessage("");
  };

  return (
    <div
      className="p-2 w-full  flex flex-col h-full"
      style={{ maxHeight: "100vh", overflow: "hidden" }}
    >
      <div
        className="flex-1 w-full p-1 overflow-y-auto  flex flex-col"
        style={{ maxHeight: "calc(100vh - 80px)" }}
      >
        {messages?.map((msg, index) => (
          <div
            key={index}
            className={`w-full flex gap-x-2 my-1 ${
              msg.senderId === user?._id ? "justify-end" : "justify-start"
            }`}
          >
            {msg.senderId !== user?._id && (
              <Avatar
                src={
                  participants?.find((p) => p._id === msg.senderId)
                    ?.avatarUrl || null
                }
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
            )}
            <div
              className={`flex flex-col gap-x-2  rounded-xl px-4 py-2 break-words text-ellipsis ${
                msg.senderId === user?._id
                  ? "text-white bg-light-secondary dark:bg-dark-secondary"
                  : "rounded-tl-none bg-gray-200 dark:bg-gray-800 "
              }`}
              style={{ maxWidth: "80%" }}
            >
              <div className="text-sm font-semibold">
                {msg.senderId !== user?._id
                  ? participants?.find((p) => p._id === msg.senderId)
                      ?.fullname || "Anonymous"
                  : ""}
              </div>
              <div className="flex  flex-col  ">
              <div className="max-w-52 break-words overflow-hidden">
                {msg.content}
              </div>
              <span className="text-xs text-gray-500 self-end">
                {formatTimeFromTimestamp(msg.createdAt)}
              </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        className="flex w-full items-end gap-x-2 "
        style={{ minHeight: "60px" }}
      >
        <MessageInput message={message} setMessage={setMessage} />
        <Button
          onPress={handleSendMessage}
          isIconOnly
          variant="ghost"
          color="primary"
          className={`h-12 w-12 flex-shrink-0 rounded-[20px] ${
            !message && "hidden"
          }`}
        >
          <PaperAirplaneIcon className="size-6" />
        </Button>
      </div>
    </div>
  );
};

export default ChatBox;
