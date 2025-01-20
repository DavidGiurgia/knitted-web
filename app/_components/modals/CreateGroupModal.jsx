"use client";

import { useAuth } from "@/app/_context/AuthContext";
import { createGroup, pairUserGroup } from "@/app/services/groupService";
import { generateUniqueJoinCode } from "@/app/services/utils";
import {
    Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import SelectFriends from "../SelectFriends";

const CreateGroupModal = ({ isOpen, onOpenChange }) => {
  const { user } = useAuth();
  const router = useRouter();

  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);

  const handleValidation = () => {
    if (!groupName.trim() || groupName.length < 3) {
      setNameError(
        groupName.length < 3
          ? "Group name must be at least 3 characters."
          : "Group name is required."
      );
      return false;
    }
    setNameError("");
    return true;
  };

  const handleCreateGroup = async () => {
    if (!handleValidation()) return;

    try {
      setLoading(true);

      const groupData = {
        creatorId: user._id,
        participants: user._id,
        name: groupName,
        description: groupDescription,
        joinCode: await generateUniqueJoinCode(),
      };

      console.log("invited frinds ids: ", selectedFriends);

      const newGroup = await createGroup(
        groupData,
        Array.from(selectedFriends)
      );

      await pairUserGroup(user._id, newGroup._id);

      toast.success("Group created successfully!");
      onOpenChange(false); // Close the modal
      router.push(`/group-room/${newGroup._id}`);
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setGroupName("");
      setGroupDescription("");
      setLoading(false);
    }
  };
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Create a New Group
            </ModalHeader>
            <ModalBody>
              <Input
                maxLength={20}
                color={nameError.length && "danger"}
                isInvalid={nameError.length}
                errorMessage={nameError}
                label="Group Name"
                value={groupName}
                onChange={(e) => {
                  setGroupName(e.target.value);
                  setNameError("");
                }}
                variant="bordered"
              />
              <Textarea
                maxLength={1000}
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                label="Description"
                variant="bordered"
                className="mb-4"
              />
              <SelectFriends
                label="Send an invitation to:"
                placeholder="Invite your friends"
                setSelectedFriends={setSelectedFriends}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                isLoading={loading}
                onPress={handleCreateGroup}
              >
                Create
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateGroupModal;
