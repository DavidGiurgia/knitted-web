"use client";

import { useWebSocket } from "@/app/_context/WebSoketContext";
import { fetchMessagesByRoom } from "@/app/api/messages";
import React, { useEffect, useState } from "react";
import MessageInput from "../../MessageInput";
import { Avatar, Button } from "@nextui-org/react";
import { PaperAirplaneIcon, UserIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/app/_context/AuthContext";
import { formatTimeFromTimestamp } from "@/app/services/utils";

const GroupChatBox = ({
  profile,
  currentGroup,
  participants,
  setParticipants,
}) => {
  const { user } = useAuth();
  const { groupSocket } = useWebSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [anonymous, setIdentity] = useState(false);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await fetchMessagesByRoom(currentGroup._id);
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }

      if (!profile || !groupSocket) {
        toast.error("profile or socket is null");
        return;
      }

      groupSocket.emit("joinRoom", {
        groupId: currentGroup._id,
        profile,
      });
      //log to console
      console.log("Joining room:", currentGroup._id);
    };

    if (currentGroup?._id && groupSocket) {
      loadMessages();
      console.log("loadding messages");
    } else {
      console.log("grup id or grSocket is null");
      return;
    }

    return () => {
      groupSocket.emit("leaveRoom", {
        groupId: currentGroup._id,
        profileId: profile.id
      });
      console.log("Leaving room:", currentGroup?._id, profile?.id);
    };
  }, [currentGroup?._id]);

  useEffect(() => {
    if (!groupSocket) return;

    // Ascultă mesaje
    const handleMessageReceived = (newMessage) => {
      console.log("Received message:", newMessage);
      setMessages((prev) => [...prev, newMessage]);
    };

    groupSocket.on("receiveMessage", handleMessageReceived);

    const handleUpdateParticipants = (updatedParticipants) => {
      console.log("participants updated:", updatedParticipants);
      setParticipants(updatedParticipants);
    };

    groupSocket.on("updateParticipants", handleUpdateParticipants);

    return () => {
      groupSocket.off("receiveMessage", handleMessageReceived);
      groupSocket.off("updateParticipants", handleUpdateParticipants);
    };
  }, [groupSocket]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    if (message.length > 500) {
      toast.error("Message is too long. Maximum length is 500 characters.");
      return;
    }

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
            {msg.senderId !== profile?.id &&
              (!msg.isAnonymous ? (
                <Avatar
                  src={
                    participants?.find((p) => p.id === msg.senderId)
                      ?.avatarUrl || null
                  }
                  alt="Avatar"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 p-1 rounded-full border ">
                  <UserIcon className=" " />
                </div>
              ))}
            <div
              className={`rounded-xl px-4 py-2  ${
                msg.senderId === profile?.id && !msg.isAnonymous
                  ? " text-white bg-light-secondary dark:bg-dark-secondary "
                  : " bg-gray-200 dark:bg-gray-800"
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
                {/* <span className="text-xs text-gray-500 self-end">
                  {formatTimeFromTimestamp(msg.createdAt)}
                </span> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex w-full items-center gap-x-2 ">
        {anonymous ? (
          <div
            className="w-10 h-10  flex-shrink-0"
            onClick={() => {
              setIdentity(false);
            }}
          >
            <UserIcon className="p-1 " />
          </div>
        ) : (
          <div
            className="w-10 h-10 flex-shrink-0"
            onClick={() => {
              setIdentity(true);
            }}
          >
            <Avatar
              size="md"
              showFallback
              src={user?.avatarUrl || null}
              className="w-full h-full"
            />
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
