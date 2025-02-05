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
} from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import SelectFriends from "../SelectFriends";
import { usePanel } from "@/app/_context/PanelContext";
import { useKeyboard } from "@/app/_context/KeyboardContext";

const CreateGroupModal = ({ isOpen, onOpenChange }) => {
  const { user } = useAuth();
  const router = useRouter();
  const { popSubPanel } = usePanel();

  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [inviteFriendsSection, setInviteFriendsSection] = useState(false);

  const handleValidation = () => {
    if (!groupName.trim()) {
      setNameError("Group name is required.");
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
        name: groupName,
        joinCode: await generateUniqueJoinCode(),
      };

      const newGroup = await createGroup(
        groupData,
        Array.from(selectedFriends)
      );

      const userAsParticipant = {
        id: user._id,
        nickname: user.fullname,
      };

      await pairUserGroup(user._id, newGroup._id, userAsParticipant);

      router.push(`/group-room/${newGroup._id}`);

      onOpenChange(false);
    } catch (error) {
      console.error("Error creating group:", error);
    } finally {
      setGroupName("");
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent className=" max-h-full overflow-y-auto ">
        <>
          <ModalHeader>New group</ModalHeader>
          <ModalBody>
            <div className="overflow-y-auto flex flex-col gap-y-2 ">
              <Input
                maxLength={20}
                color={nameError.length && "danger"}
                isInvalid={!!nameError}
                errorMessage={nameError}
                label="Group subject"
                value={groupName}
                onChange={(e) => {
                  setGroupName(e.target.value);
                  setNameError("");
                }}
                variant="bordered"
              />

              <SelectFriends setSelectedFriends={setSelectedFriends} />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={loading}
              className="w-full"
              color="primary"
              onPress={handleCreateGroup}
            >
              Create
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default CreateGroupModal;
