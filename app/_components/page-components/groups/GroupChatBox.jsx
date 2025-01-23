"use client";

import { useWebSocket } from "@/app/_context/WebSoketContext";
import { fetchMessagesByRoom } from "@/app/api/messages";
import React, { useEffect, useState } from "react";
import MessageInput from "../../MessageInput";
import { Avatar, Button } from "@nextui-org/react";
import { PaperAirplaneIcon, UserIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/app/_context/AuthContext";
import GroupMessagesItem from "./GroupMessagesItem";

const GroupChatBox = ({ participant, currentGroup, participants, setParticipants }) => {
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
      groupSocket.emit("joinRoom", {
        groupId: currentGroup._id,
        participant,
      });
      console.log("Joining room:", currentGroup._id, " as ", participant);
    };

    if (currentGroup?._id && participant && groupSocket) {
      loadMessages();
    }

    return async () => {
      groupSocket.emit("leaveRoom", {
        groupId: currentGroup?._id,
        participant,
      });
      console.log("Leaving room:", currentGroup?._id, " as ", participant?.id);
    };
  }, [currentGroup?._id, user?._id]);

  useEffect(() => {
    console.log("Group socket connected:", groupSocket.connected);
    if (!groupSocket) return;

    // Ascultă mesaje
    const handleMessageReceived = async (newMessage) => {
      console.log("Received message:", newMessage);
      setMessages((prev) => [...prev, newMessage]);
    };

    groupSocket.on("receiveMessage", handleMessageReceived);

    groupSocket.on('updateParticipants', (participants) => {
      console.log('Updated participants:', participants);
    
      const normalizedParticipants = participants.map(participant => ({
        id: participant.id,
        nickname: participant.nickname || participant.name || 'Unknown', // Normalizare
      }));
    
      setParticipants(normalizedParticipants);
    });
    

    return () => {
      groupSocket.off("receiveMessage", handleMessageReceived);
      groupSocket.off('updateParticipants', (participants) => {
        console.log('Updated participants:', participants);
      });
    };
  }, [groupSocket]);

  const handleSendMessage = () => {
    if (!message.trim() || !groupSocket) return;

    if (message.length > 500) {
      toast.error("Message is too long. Maximum length is 500 characters.");
      return;
    }

    const messageData = {
      groupId: currentGroup._id,
      content: message,
      participant,
      isAnonymous: anonymous,
    };

    console.log("sending message: ", messageData);
    console.log("Group socket connected:", groupSocket.connected);

    groupSocket.emit("sendMessage", messageData);
    setMessage("");
  };

  return (
    <div className="flex flex-col p-2  h-full items-center w-full ">
      <GroupMessagesItem messages={messages} participant={participant} participants={participants}/>

      <div className="flex w-full items-center gap-x-2 ">
        {anonymous ? (
          <div
            className="w-10 h-10  flex-shrink-0"
            onClick={() => {
              setIdentity(false);
            }}
          >
            <UserIcon className="p-2 rounded-full  border border-gray-200 dark:border-gray-800 " />
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
