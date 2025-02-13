"use client";

import { fetchMessagesByRoom } from "@/app/api/messages";
import React, { useEffect, useState } from "react";
import MessageInput from "../../MessageInput";
import { Avatar, Button } from "@heroui/react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/app/_context/AuthContext";
import GroupMessagesItem from "./GroupMessagesItem";
import toast from "react-hot-toast";
import InitialsAvatar from "../../InitialsAvatar";
import { UserIcon } from "@heroicons/react/16/solid";

const GroupChatBox = ({ participant, group, groupSocket }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [anonymous, setAnonymous] = useState(false);

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
    <div className="flex flex-col flex-1 items-center max-w-[800px] h-full p-2 ">
      {/* Mesaje */}
      <GroupMessagesItem messages={messages} participant={participant} />

      {/* Message Input - Fixat jos */}
      <div
        className="flex w-full items-end gap-x-2 "
        style={{ minHeight: "50px" }}
      >
        <MessageInput
          anonymousMode={true}
          senderName={participant?.nickname}
          anonymous={anonymous}
          setAnonymous={setAnonymous}
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default GroupChatBox;
