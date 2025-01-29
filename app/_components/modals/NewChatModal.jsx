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

const NewChatModal = ({ isOpen, onOpenChange, onCreate }) => {
  const [participants, setParticipants] = useState([]);
  const [name, setName] = useState("");
  const { user } = useAuth(); // Get the current user

  const handleSend = async () => {
    const participantsArray = Array.from(participants);

    if (participantsArray.length < 1) {
      console.error("No participants selected");
      return;
    }

    await onCreate(name, participantsArray); // Pass the original participants array
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
              {Array.from(participants).length > 1 && (
                <Input
                  label="Group Name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="bordered"
                />
              )}
              <SelectFriends
                label="To:"
                placeholder="Select participants"
                setSelectedFriends={setParticipants}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                isDisabled={Array.from(participants).length < 1}
                color="primary"
                onPress={handleSend}
              >
                Chat
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default NewChatModal;