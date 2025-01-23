import { UserIcon } from "@heroicons/react/24/outline";
import { Avatar } from "@nextui-org/react";
import React from "react";

const GroupMessagesItem = ({ messages, participant, participants }) => {
  return (
    <div className="flex-1 w-full px-2 overflow-y-auto">
      {messages?.map((msg, index) => {
        const isSameSenderAsPrevious =
          index > 0 && messages[index - 1]?.senderId === msg.senderId;
        const sender = participants.find(
          (p) => p.id === msg.senderId
        ); // Găsim participantul

        return (
          <div
            key={index}
            className={`w-full flex gap-x-2 my-1 ${
              msg.type === "log"
                ? "justify-center"
                : msg.senderId === participant?.id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            {/* Avatar sau UserIcon */}
            {msg.type !== "log" &&
              msg.senderId !== participant?.id &&
              !isSameSenderAsPrevious && (
                <div className="w-8 h-8 flex-shrink-0">
                  {msg.isAnonymous ? (
                    <UserIcon className="p-1 rounded-full border-gray-200 dark:border-gray-800" />
                  ) : (
                    <Avatar
                      src={null}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                </div>
              )}

            {/* Conținut mesaj */}
            <div
              className={`rounded-xl px-4 py-2 ${
                msg.senderId === participant?.id && !msg.isAnonymous
                  ? "text-white bg-light-secondary dark:bg-dark-secondary"
                  : "bg-gray-200 dark:bg-gray-800"
              } ${msg.type === "log" ? "my-2" : ""}`}
            >
              {/* Nickname */}
              {!isSameSenderAsPrevious &&
                msg.senderId !== participant?.id &&
                sender?.nickname && (
                  <div className="font-semibold text-sm">{sender.nickname}</div>
                )}

              {/* Conținut mesaj */}
              {msg.type === "log" ? (
                <div
                  className={`${
                    msg.level === "info"
                      ? "text-gray-600"
                      : msg.level === "success"
                      ? "text-green-500"
                      : msg.level === "warning"
                      ? "text-yellow-500"
                      : msg.level === "danger"
                      ? "text-red-500"
                      : ""
                  } text-sm`}
                >
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
    </div>
  );
};

export default GroupMessagesItem;
