import { UserIcon } from "@heroicons/react/24/outline";
import { Avatar } from "@nextui-org/react";
import React, { useEffect, useRef } from "react";

const GroupMessagesItem = ({ messages, participant, participants }) => {
  if (!messages || !participants) return null;

  let lastSenderId = null;
  let lastMessageWasAnonymous = false;
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 w-full px-2 overflow-y-auto">
      {messages.map((msg, index) => {
        const isSameSenderAsPrevious =
          index > 0 &&
          messages[index - 1].senderId === msg.senderId &&
          lastMessageWasAnonymous === msg.isAnonymous;
        const sender = participants.find((p) => p.id === msg.senderId);
        const isCurrentUser = msg.senderId === participant?.id;
        const showAvatar =
          msg.type !== "log" &&
          (!isSameSenderAsPrevious ||
            (msg.isAnonymous && !lastMessageWasAnonymous)) &&
          !isCurrentUser;

        // Update last sender info
        lastSenderId = msg.senderId;
        lastMessageWasAnonymous = msg.isAnonymous;

        return (
          <div
            onClick={()=>{}}
            key={index}
            className={`w-full flex gap-x-2 my-1 ${!isSameSenderAsPrevious && "mt-2"} ${
              msg.type === "log"
                ? "justify-center"
                : isCurrentUser
                ? "justify-end"
                : "justify-start"
            }`}
          >
            {showAvatar && (
              <div className="w-8 h-8 flex-shrink-0">
                {msg.isAnonymous ? (
                  <UserIcon className="p-1 rounded-full border border-gray-200 dark:border-gray-800" />
                ) : (
                  <Avatar
                    src={sender?.avatar || null}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                )}
              </div>
            )}

            <div
              className={`relative rounded-xl ${showAvatar && "rounded-tl-none"} px-4 py-2 ${
                isCurrentUser && !msg.isAnonymous
                  ? "bg-primary bg-opacity-10"
                  : "bg-gray-200 dark:bg-gray-800"
              } ${msg.type === "log" ? "my-2" : ""}`}
              style={{
                marginLeft: !showAvatar && !isCurrentUser ? "2.5rem" : "0",
              }}
            >
              {!isSameSenderAsPrevious && !isCurrentUser && (
                <div className="font-semibold text-sm">
                  {msg.isAnonymous ? "Anonymous" : sender?.nickname}
                </div>
              )}

              {msg.type === "log" ? (
                <div className={`text-sm ${getLogLevelClass(msg.level)}`}>
                  {msg.content}
                </div>
              ) : (
                <div className="max-w-52 break-words overflow-hidden">
                  {msg.content}
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

const getLogLevelClass = (level) => {
  switch (level) {
    case "info":
      return "text-gray-600";
    case "success":
      return "text-green-500";
    case "warning":
      return "text-yellow-500";
    case "danger":
      return "text-red-500";
    default:
      return "";
  }
};

export default GroupMessagesItem;
