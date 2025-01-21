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
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (group) {
      setGroupName(group.name || "");
      setGroupDescription(group.description || "");
      setCode(group.joinCode || "");
    }
  }, [group, onOpenChange]);

  useEffect(() => {
    const hasChanges =
      groupName !== (group?.name || "") ||
      groupDescription !== (group?.description || "") ||
      code !== (group?.joinCode || "");
    setIsModified(hasChanges);
  }, [groupName, groupDescription, code, group]);

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

    if (code.length < 5) {
      setCodeError("Code must be at least 5 characters long.");
      return false;
    }
    setCodeError("");

    return true;
  };

  const handleUpdateGroup = async () => {
    if (!handleValidation()) return;

    try {
      setLoading(true);

      const updatedGroup = {
        name: groupName,
        description: groupDescription,
        joinCode: code,
      };

      await updateGroup(group._id, updatedGroup); // Save changes to the backend
      toast.success("Group updated successfully!");
      group.name = groupName;
      group.description = groupDescription;
      group.joinCode = code;
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
              Edit Group
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-y-2">
                <Input
                  maxLength={10}
                  color={codeError.length && "danger"}
                  isInvalid={codeError.length}
                  errorMessage={codeError}
                  label="Join code"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setCodeError("");
                  }}
                  variant="faded"
                  className="text-primary mb-4"
                />
                <Input
                  maxLength={20}
                  color={nameError.length && "danger"}
                  isInvalid={nameError.length}
                  errorMessage={nameError}
                  label="Group name"
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
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                isLoading={loading}
                isDisabled={!isModified}
                onPress={handleUpdateGroup}
              >
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UpdateGroupModal;
