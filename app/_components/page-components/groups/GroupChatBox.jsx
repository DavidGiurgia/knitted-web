"use client";

import { fetchMessagesByRoom } from "@/app/api/messages";
import React, { useEffect, useState } from "react";
import MessageInput from "../../MessageInput";
import { Avatar, Button } from "@heroui/react";
import { PaperAirplaneIcon, UserIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/app/_context/AuthContext";
import GroupMessagesItem from "./GroupMessagesItem";
import toast from "react-hot-toast";
import InitialsAvatar from "../../InitialsAvatar";

const GroupChatBox = ({
  participant,
  group,
  groupSocket,
}) => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [anonymous, setIdentity] = useState(false);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await fetchMessagesByRoom(group._id);
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    if (group?._id) {
      loadMessages();
    }
  }, [group]);

  useEffect(() => {
    if (!groupSocket) return;

    const handleMessageReceived = async (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    };

    groupSocket.on("receiveMessage", handleMessageReceived);

    return () => {
      groupSocket.off("receiveMessage", handleMessageReceived);
    };
  }, [groupSocket]);

  const handleSendMessage = () => {
    if (!message.trim() || !groupSocket) return;

    if (message.length > 500) {
      toast.error("Message is too long. Maximum length is 500 characters.");
      return;
    }

    const messageData = {
      groupId: group._id,
      content: message,
      senderId: participant.id,
      senderName: participant.nickname,
      isAnonymous: anonymous,
    };

    groupSocket.emit("sendMessage", messageData);
    setMessage("");
  };

  return (
    <div className="flex flex-col p-1  flex-1 items-center w-full h-full">
      <GroupMessagesItem
        messages={messages}
        participant={participant}
      />

      <div className="flex w-full items-center gap-x-2 ">
        {anonymous ? (
          <div
            className="w-12 h-12  flex-shrink-0"
            onClick={() => {
              setIdentity(false);
            }}
          >
            <UserIcon className="p-2 rounded-full  border border-gray-200 dark:border-gray-800 " />
          </div>
        ) : (
          <div
            className="flex-shrink-0 cursor-pointer"
            onClick={() => {
              setIdentity(true);
            }}
          >
            <InitialsAvatar nickname={participant?.nickname || "U"} size={48}/>
          </div>
        )}

        <MessageInput message={message} setMessage={setMessage} />

        <Button
          onPress={handleSendMessage}
          isIconOnly
          variant="ghost"
          color={anonymous ? "" : "primary"}
          className={`h-12 w-12 flex-shrink-0 rounded-[20px] ${
            !message && "hidden"
          }`}
          disabled={!message.trim()}
        >
          <PaperAirplaneIcon className="size-6" />
        </Button>
      </div>
    </div>
  );
};

export default GroupChatBox;
