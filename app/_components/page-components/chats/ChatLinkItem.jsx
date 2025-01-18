'use client';

import React, { useEffect, useState } from "react";
import { Avatar, Tooltip } from "@nextui-org/react"; // Poți folosi o bibliotecă de UI pentru avatare
import { getUserById } from "@/app/services/userService";
import { useAuth } from "@/app/_context/AuthContext";

const ChatLinkItem = ({ room }) => {
  const [participants, setParticipants] = useState([]);
  const { user } = useAuth();

  const fetchParticipantDetails = async () => {
    const participantDetails = await Promise.all(
      room?.participants.map(async (participantId) => {
        try {
          //ignore current user
          if (participantId === user._id) return null;

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
    };
    if (user?._id && room?.participants) {
      fetchParticipants();
    }
  }, [room]);

  const displayedUsers = participants.slice(0, 2);

  return (
    <div className="flex items-center gap-2 py-1">
      {/* Grupul de avatare */}
      <div className="flex -space-x-6 space-y-2">
        {displayedUsers.map((user, index) => (
          <Tooltip key={index} content={user.username}>
            <Avatar
            className="border border-gray-100 dark:border-gray-900"
              src={user.avatarUrl || ""}
              alt={user?.fullname || user.username}
            />
          </Tooltip>
        ))}
      </div>

      {/* Text descriptiv */}
      <span className="">{room.name}</span>
    </div>
  );
};

export default ChatLinkItem;
