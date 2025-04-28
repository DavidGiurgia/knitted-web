'use client';

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";
import React, { useState } from "react";
import SelectFriends from "../../SelectFriends";
import { useAuth } from "@/app/_context/AuthContext";
import { createRoom } from "@/app/api/rooms";
import { usePanel } from "@/app/_context/PanelContext";

const NewChatSection = () => {
  const [participants, setParticipants] = useState([]);
  const [name, setName] = useState("");
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { pushSubPanel, popSubPanel } = usePanel();

  const handleCreateRoom = async () => {
    const participantsArray = Array.from(participants);

    if (participantsArray.length < 1) {
      console.error("No participants selected");
      return;
    }

    setLoading(true);
    try {
      const participants = Array.from(
        new Set([...participantsArray, user._id])
      );
      // Creăm camera folosind numele calculat
      const room = await createRoom(name, participants);

      
      popSubPanel();

      pushSubPanel("ChatRoom", room);
    } catch (error) {
      console.error("Error creating room:", error);
    }
    setLoading(false);
  };

  return (
    <div className="h-full w-full p-2 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-x-2 flex-shrink-0">
        <Button onPress={popSubPanel} variant="light" isIconOnly>
          <ArrowLeftIcon className="size-5" />
        </Button>
        <div className="font-semibold text-lg">New chat</div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto my-2 px-2">
        <SelectFriends
          label="Participants:"
          setSelectedFriends={setParticipants}
        />
      </div>

      {/* Footer */}
      <div className="w-full py-2 flex-shrink-0">
        <Button
          isLoading={loading}
          className="w-full"
          isDisabled={Array.from(participants).length < 1}
          color="primary"
          onPress={handleCreateRoom}
        >
          Chat
        </Button>
      </div>
    </div>
  );
};

export default NewChatSection;