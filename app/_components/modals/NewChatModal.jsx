import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React, { useState } from "react";
import SelectFriends from "../SelectFriends";
import { getUserById } from "@/app/services/userService";

const NewChatModal = ({ isOpen, onOpenChange, onCreate }) => {
  const [participants, setParticipants] = useState([]);
  const [name, setName] = useState("");

  const handleSend = async () => {
    // Convertim Set în Array
    const participantsArray = Array.from(participants);
  
    if (participantsArray.length === 0) {
      console.error("No participants selected");
      return;
    }
  
    let groupName = name;
  
    // Obținem primul participant
    const firstParticipant = await getUserById(participantsArray[0]);
  
    if (participantsArray.length === 1) {
      groupName = firstParticipant.fullname; // Utilizator unic
    } else if (participantsArray.length > 1 && !groupName) {
      groupName = `${firstParticipant.fullname} and ${
        participantsArray.length - 1
      } others`;
    }

  
    await onCreate(groupName, participantsArray);
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
