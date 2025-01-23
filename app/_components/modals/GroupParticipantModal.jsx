"use client";

import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

const GroupParticipantModal = ({
  isOpen,
  onOpenChange,
  participant,
  onConfirm
}) => {
  const [nickname, setNickname] = useState(participant?.nickname || "");
  const [nicknameError, setNicknameError] = useState("");
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    setIsModified(nickname !== participant?.nickname);
  }, [nickname]);

  useEffect(() => {
    if (participant) {
      setNickname(participant?.nickname || "Unknown");
    }
  }, [participant, isOpen]);

  const handleSave = async () => {
    if (nickname === participant.nickname) 
    {
      onOpenChange(false);
      return;
    }

    if (!nickname.trim()) {
      setNicknameError("Name cannot be empty.");
      return;
    }
    if (nickname.length < 3) {
      setNicknameError("Your name should have at least three characters.");
      return;
    }

    try {
      const newParticipantProfile = {
        id: participant.id,
        nickname: nickname,
      };
      await onConfirm(newParticipantProfile);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      setNicknameError("Failed to save profile. Please try again.");
    }
  };

  return (
    <Modal className="w-fit" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>My profile</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-y-6 items-center justify-center px-6">
                <Avatar src={null} size="lg" />

                <div>
                  <Input
                    variant="underlined"
                    size="lg"
                    type="text"
                    label="Nickname"
                    isInvalid={!!nicknameError.length}
                    errorMessage={nicknameError}
                    className="w-full"
                    value={nickname}
                    onChange={(e) => {
                      setNickname(e.target.value);
                      setNicknameError("");
                    }}
                    onClear={() => setNickname("")}
                    isClearable
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button isDisabled={!isModified} color="primary" onPress={handleSave}>
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default GroupParticipantModal;
