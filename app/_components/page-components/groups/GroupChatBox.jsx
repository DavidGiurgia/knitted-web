"use client";

import { useWebSocket } from "@/app/_context/WebSoketContext";
import { fetchMessagesByRoom } from "@/app/api/messages";
import React, { useEffect, useState } from "react";
import MessageInput from "../../MessageInput";
import { Avatar, Button } from "@nextui-org/react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/app/_context/AuthContext";
import { formatTimeFromTimestamp } from "@/app/services/utils";

const GroupChatBox = ({
  anonymous,
  profile,
  currentGroup,
  participants,
  setParticipants,
}) => {
  const { user } = useAuth();
  const { groupSocket } = useWebSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await fetchMessagesByRoom(currentGroup?._id);
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    loadMessages();
  }, [currentGroup?._id]);

  useEffect(() => {
    if (!groupSocket || !currentGroup?._id) return;

    groupSocket.emit("joinRoom", {
      groupId: currentGroup?._id,
      profile,
    });

    groupSocket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    groupSocket.on("updateParticipants", (participants) => {
      console.log("updated participants  #### ->>>", participants);
      setParticipants(participants); // Stochează întreaga listă
    });

    return () => {
      groupSocket.emit("leaveRoom", { groupId: currentGroup?._id });
      groupSocket.off("receiveMessage");
      groupSocket.off("updateParticipants");
    };
  }, [groupSocket, currentGroup?._id, profile]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const messageData = {
      groupId: currentGroup._id,
      content: message,
      profile,
      isAnonymous: anonymous,
    };

    groupSocket.emit("sendMessage", messageData);
    setMessage("");
  };

  return (
    <div className="flex flex-col p-2 h-full items-center w-full max-w-[600px]">
      <div className="flex-1 w-full px-2 overflow-y-auto">
        {messages?.map((msg, index) => (
          <div
            key={index}
            className={`w-full flex gap-x-2 my-1 ${
              msg.senderId === profile?.id ? "justify-end" : "justify-start "
            }`}
          >
            {msg.senderId !== profile?.id && (
              <Avatar
                src={
                  participants?.find((p) => p.id === msg.senderId)
                    ?.avatarUrl || null
                }
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
            )}
            <div
              className={`rounded-xl px-4 py-2  ${
                msg.senderId === profile?.id
                  ? "rounded-tr-none text-white bg-light-secondary dark:bg-dark-secondary "
                  : "rounded-tl-none bg-gray-200 dark:bg-gray-800"
              } `}
            >
              <div className="font-semibold text-sm">
                {msg.senderId !== profile?.id &&
                  (msg.isAnonymous
                    ? "Anonymous"
                    : participants.find(
                        (participant) => participant.id === msg.senderId
                      )?.username)}
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

      <div className="flex w-full items-end gap-x-2 ">
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

export default GroupChatBox;
