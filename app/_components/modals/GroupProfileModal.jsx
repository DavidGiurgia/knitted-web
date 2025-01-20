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
import { updateProfile } from "@/app/services/guestService";

const GroupProfileModal = ({ isOpen, onOpenChange, profile,  onConfirm }) => {
  const [username, setUsername] = useState(profile?.username || "");
  const [usernameError, setUsernameError] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(
    profile?.avatarUrl || ""
  );

  useEffect(() => {
    if (profile) {
      setUsername(profile?.username || "Unknown");
      setSelectedAvatar(profile?.avatarUrl || "");
    }
  }, [profile, isOpen]);

  const handleSave = () => {
    if (!username.trim()) {
        setUsernameError("Name cannot be empty.");
        return false;
      }
      if (username.length < 3) {
        setUsernameError("Your name should have at least three characters.");
        return false;
      }
      setUsernameError(""); // Reset error

      try {
        const newProfile = {
            id:profile.id,
            username,
            avatarUrl: selectedAvatar,
        }
        onConfirm(newProfile); //
        onOpenChange(false); // Închide modalul după salvare
      } catch (error) {
        console.error("Failed to save profile:", error);
        setUsernameError("Failed to update profile. Please try again.");
      }
  };
  return (
    <Modal className="w-fit " isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="">My profile</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-y-6 items-center justify-center px-6">
                <Avatar src={selectedAvatar} size="lg" />

                <div>
                  <Input
                    variant="underlined"
                    size="lg"
                    type="text"
                    label="Name"
                    isInvalid={!!usernameError.length}
                    errorMessage={usernameError}
                    className="w-full"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setUsernameError("");
                    }}
                    onClear={() => setUsername("")}
                    isClearable
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSave}>
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default GroupProfileModal;
