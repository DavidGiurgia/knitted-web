import React, { useEffect, useState } from "react";
import { Button, Input } from "@heroui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { createGroup, pairUserGroup } from "@/app/services/groupService";
import { generateUniqueJoinCode } from "@/app/services/utils";
import SelectFriends from "../../SelectFriends";
import { useAuth } from "@/app/_context/AuthContext";
import { useRouter } from "next/navigation";
import { usePanel } from "@/app/_context/PanelContext";

const CreateGroupSection = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { popSubPanel } = usePanel();

  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
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
        description: groupDescription,
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

      popSubPanel();

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
    <div className="h-full w-full p-2 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-x-2 flex-shrink-0">
        <Button onPress={popSubPanel} variant="light" isIconOnly>
          <ArrowLeftIcon className="size-5" />
        </Button>
        <div className="font-semibold text-lg">New group</div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto my-2 flex flex-col gap-y-2 px-2">
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
        <label>Send an invitation to your friends</label>
        <SelectFriends setSelectedFriends={setSelectedFriends} />
      </div>

      {/* Footer */}
      <div className="w-full py-2 flex-shrink-0">
        <Button
          isLoading={loading}
          className="w-full"
          color="primary"
          onPress={handleCreateGroup}
          //isDisabled={!groupName.trim()}
        >
          Create
        </Button>
      </div>
    </div>
  );
};

export default CreateGroupSection;
