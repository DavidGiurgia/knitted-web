"use client";

import { useAuth } from "@/app/_context/AuthContext";
import { updateGroup } from "@/app/services/groupService";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
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

const UpdateGroupModal = ({ isOpen, onOpenChange, group = null }) => {
  const { user } = useAuth();

  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (group) {
      setGroupName(group.name || "");
      setGroupDescription(group.description || "");
    }
  }, [group]);

  const isCreator = group?.creatorId === user?._id;

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

  const handleUpdateGroup = async () => {
    if (!handleValidation()) return;

    try {
      setLoading(true);

      const updatedGroup = {
        name: groupName,
        description: groupDescription,
      };

      await updateGroup(group._id, updatedGroup); // Save changes to the backend
      toast.success("Group updated successfully!");
      group.name = groupName;
      group.description = groupDescription;
      onOpenChange(false); // Close the modal
    } catch (error) {
      console.error("Error updating group:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {isCreator ? "Edit Group" : "Group Details"}
            </ModalHeader>
            <ModalBody>
              <Input
                maxLength={20}
                color={nameError.length && "danger"}
                isInvalid={nameError.length}
                errorMessage={nameError}
                isReadOnly={!isCreator} // Readonly if the user is not the creator
                label="Group Name"
                value={groupName}
                onChange={(e) => {
                  setGroupName(e.target.value);
                  setNameError("");
                }}
                variant="bordered"
                autofocus
              />
              <Textarea
                maxLength={1000}
                isReadOnly={!isCreator} // Readonly if the user is not the creator
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                label="Description"
                variant="bordered"
                className="mb-4"
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                {!isCreator ? "Close" : "Cancel"}
              </Button>
              {isCreator ? (
                <Button
                  color="primary"
                  isLoading={loading}
                  onPress={handleUpdateGroup}
                >
                  Save
                </Button>
              ) : null}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UpdateGroupModal;
