"use client";

import React, { useEffect, useState } from "react";
import { Avatar, Tooltip } from "@nextui-org/react"; // Poți folosi o bibliotecă de UI pentru avatare
import { getUserById } from "@/app/services/userService";
import { useAuth } from "@/app/_context/AuthContext";
import { getLastMessageForRoom } from "@/app/api/messages";
import { getRoomNameByParticipants } from "@/app/services/utils";

const ChatMembersItem = ({ room, variant = "list" }) => {
  const [participants, setParticipants] = useState([]);
  const { user } = useAuth();
  const [lastMessage, setLastMessage] = useState("");
  const [roomName, setRoomName] = useState("");

  const fetchParticipantDetails = async () => {
    const lastMessage = await getLastMessageForRoom(room?._id);
    setLastMessage(lastMessage);

    const participantDetails = await Promise.all(
      room?.participants.map(async (participantId) => {
        try {
          return await getUserById(participantId); // Extragerea detaliilor utilizatorului
        } catch (error) {
          console.error("Error fetching participant:", error);
          return null;
        }
      })
    );

    return participantDetails.filter(Boolean); // Elimină utilizatorii null (dacă există erori)
  };

  useEffect(() => {
    const fetchParticipants = async () => {
      const currentRoomParticipants = await fetchParticipantDetails();
      setParticipants(currentRoomParticipants);

      const nameByParticipants = getRoomNameByParticipants(
        currentRoomParticipants,
        user?._id
      );
      setRoomName(nameByParticipants);
    };
    if (user?._id && room?.participants) {
      fetchParticipants();
    }
  }, [room]);

  const displayedUsers = room.isGroup
    ? participants.slice(0, 2)
    : participants.filter((p) => p._id !== user?._id);

  return (
    <div className="flex items-center gap-2 py-1">
      {/* Grupul de avatare */}
      <div className="flex -space-x-7 space-y-3">
        {displayedUsers.map((user, index) => (
          <Tooltip key={index} content={user.username}>
            <Avatar
              size={
                variant === "list"
                  ? room.isGroup
                    ? "md"
                    : "lg"
                  : room.isGroup
                  ? "sm"
                  : "md"
              }
              className="border border-gray-100 dark:border-gray-900"
              src={user.avatarUrl || ""}
              alt={user?.fullname || user.username}
            />
          </Tooltip>
        ))}
      </div>

      {/* Text descriptiv */}
      <div className={`flex flex-col ${variant === "list" ? "gap-y-1" : ""}`}>
        <span className="">{room.name || roomName}</span>
        {variant === "list" ? (
          lastMessage?.content ? (
            <pre className="text-gray-500 text-sm font-semibold">
              {`${
                room.isGroup
                  ? user?._id === lastMessage?.senderId
                    ? "You: "
                    : participants?.find((p) => p._id === lastMessage?.senderId)
                        ?.fullname + ": "
                  : ""
              }`}
              <span className="font-medium ">{lastMessage?.content}</span>
            </pre>
          ) : (
            <p className="text-sm text-gray-500">
              {room.name ? roomName : "Start a conversation"}
            </p>
          )
        ) : variant === "details" ? (
          <p className="text-sm text-gray-500">
            {room.name
              ? roomName + " >"
              : room.isGroup
              ? "Tap here for group info"
              : participants?.find((p) => p._id === lastMessage?.senderId)
                  ?.username + " >"}
          </p>
        ) : (
          <div>nmc</div>
        )}
      </div>
    </div>
  );
};

export default ChatMembersItem;
