"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../_context/AuthContext";
import {
  Alert,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  Textarea,
} from "@nextui-org/react";
import { generateUniqueJoinCode } from "../../services/utils";
import {
  createGroup,
  updateGroup,
  pairUserGroup,
} from "../../services/groupService";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import SelectFriends from "../SelectFriends";

const GroupModal = ({ isOpen, onOpenChange, group = null }) => {
  const router = useRouter();
  const { user } = useAuth();

  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState("");

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

      const newGroup = await createGroup(groupData);

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

  useEffect(() => {
    if (group) {
      setGroupName(group.name || "");
      setGroupDescription(group.description || "");
    } else {
      setGroupName("");
      setGroupDescription("");
    }
  }, [group]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {group
                ? isCreator
                  ? "Edit Group"
                  : "Group Details"
                : "Create a New Group"}
            </ModalHeader>
            <ModalBody>
              <Input
                maxLength={20}
                color={nameError.length && "danger"}
                isInvalid={nameError.length}
                errorMessage={nameError}
                isReadOnly={group && !isCreator} // Readonly if the user is not the creator
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
                isReadOnly={group && !isCreator} // Readonly if the user is not the creator
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                label="Description"
                variant="bordered"
                className="mb-4"
              />
              {!group && 
                <SelectFriends label="Send an invitation to:" placeholder="Invite your friends" setSelectedFriends={()=>{}} />
              }
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                {group && !isCreator ? "Close" : "Cancel"}
              </Button>
              {isCreator || !group ? (
                <Button
                  color="primary"
                  isLoading={loading}
                  onPress={group ? handleUpdateGroup : handleCreateGroup}
                >
                  {group ? "Save" : "Create"}
                </Button>
              ) : null}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default GroupModal;
