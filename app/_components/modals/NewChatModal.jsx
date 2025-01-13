import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import React, { useState } from "react";
import SelectFriends from "../SelectFriends";
import { useAuth } from "@/app/_context/AuthContext";
import { createRoom } from "@/app/api/rooms";

const NewChatModal = ({ isOpen, onOpenChange, onCreate }) => {
  const { user } = useAuth();
  const [participants, setParticipants] = useState([]);
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    console.log("Send message to:", participants);

    // Convertim Set în Array
    const participantsArray = Array.from(participants);

    // Adăugăm și pe utilizatorul curent
    participantsArray.push(user._id);

    const room = await createRoom(participantsArray);

    console.log("Created room:", room);

    onCreate(room);
  };
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Start a new conversation
            </ModalHeader>
            <ModalBody>
              <Textarea
                placeholder="Type a message"
                className="w-full"
                variant="bordered"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <SelectFriends
                placeholder="To"
                setSelectedFriends={setParticipants}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                isDisabled={participants.size === 0 || !message}
                color="primary"
                onPress={handleSend}
              >
                Send
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default NewChatModal;
