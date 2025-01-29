"use client";

import React, { useEffect, useRef } from "react";
import { Avatar } from "@heroui/react";

const PrivateMessagesItem = ({room, messages, participant, participants }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      className="flex-1 w-full p-1 overflow-y-auto flex flex-col"
      style={{ maxHeight: "calc(100vh - 80px)" }}
    >
      {messages?.map((msg, index) => {
        const isGroup = room.isGroup;
        const isSameSenderAsPrevious =
          index > 0 && messages[index - 1].senderId === msg.senderId;
        const sender = participants?.find((p) => p._id === msg.senderId);
        const isCurrentUser = msg.senderId === participant?._id;
        const showAvatar =
        isGroup && msg.type !== "log" && !isSameSenderAsPrevious && !isCurrentUser;

        return (
          <div
            key={index}
            className={`w-full flex gap-x-2 mb-1 ${
              isCurrentUser ? "justify-end" : "justify-start"
            }`}
          >
            {showAvatar && (
              <Avatar
                src={sender?.avatarUrl || null}
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
            )}
            <div
              className={`flex flex-col gap-x-2 rounded-xl px-4 py-2 break-words text-ellipsis ${
                isCurrentUser
                  ? `${
                      isSameSenderAsPrevious ? "" : "rounded-tr-none"
                    }  bg-primary bg-opacity-10 `
                  : `${
                      isSameSenderAsPrevious ? "" : "rounded-tl-none"
                    } bg-gray-100 dark:bg-gray-800`
              }`}
              style={{
                marginLeft: !showAvatar && !isCurrentUser  && isGroup ? "2.5rem" : "0",
                maxWidth: "80%",
              }}
            >
              {!isSameSenderAsPrevious && !isCurrentUser && isGroup && (
                <div className="text-sm font-semibold">
                  {sender?.fullname || "Anonymous"}
                </div>
              )}
              <div className={`flex ${msg.content.length > 5 ? "flex-col" : "flex-row gap-x-2"} `}>
                <div className="max-w-52 break-words overflow-hidden">
                  {msg.content}
                </div>
                <span className="text-xs text-gray-500 self-end ">
                  {formatTimeFromTimestamp(msg.createdAt)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default PrivateMessagesItem;

const formatTimeFromTimestamp = (timestamp) => {
  // Implement your time formatting logic here
  return new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};
