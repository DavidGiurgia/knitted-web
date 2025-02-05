import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import React, { useState } from "react";
import SelectFriends from "../SelectFriends";
import { useAuth } from "@/app/_context/AuthContext"; // Assuming useAuth provides the current user
import { usePanel } from "@/app/_context/PanelContext";
import { createRoom } from "@/app/api/rooms";

const NewChatModal = ({ isOpen, onOpenChange }) => {
  const [participants, setParticipants] = useState([]);
  const [name, setName] = useState("");
  const { user } = useAuth(); // Get the current user
  const { pushSubPanel } = usePanel();
  const [loading, setLoading] = useState(false);

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
      pushSubPanel("ChatRoom", room);
    } catch (error) {
      console.error("Error creating room:", error);
    }
    setLoading(false);

    // close modal
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <>
          <ModalHeader className="border-b border-gray-300 dark:border-gray-700">
            New chat
          </ModalHeader>
          <ModalBody className="overflow-y-auto">
            <SelectFriends
              label="Participants:"
              setSelectedFriends={setParticipants}
            />
          </ModalBody>
          <ModalFooter>
            <Button
            isLoading={loading}
              className="w-full"
              isDisabled={Array.from(participants).length < 1}
              color="primary"
              onPress={handleCreateRoom}
            >
              Chat
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default NewChatModal;
