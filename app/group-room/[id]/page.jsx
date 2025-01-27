"use client";

import GroupInfoSidebar from "@/app/_components/GroupInfoSidebar";
import GroupParticipantModal from "@/app/_components/modals/GroupParticipantModal";
import GroupChatBox from "@/app/_components/page-components/groups/GroupChatBox";
import InteractionsTabs from "@/app/_components/page-components/groups/InteractionsTabs";
import { useAuth } from "@/app/_context/AuthContext";
import { getGroupById } from "@/app/services/groupService";
import {
  getCurrentParticipant,
  updateParticipantProfile,
} from "@/app/services/guestService";

import { Bars3Icon } from "@heroicons/react/24/outline";
import { Avatar, Button, useDisclosure } from "@nextui-org/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const GroupRoom = () => {
  const { user } = useAuth();
  const params = useParams();
  const [sidebar, setSidebar] = useState(false);
  const [groupDetails, setGroupDetails] = useState(null);
  const [participant, setParticipant] = useState(null);
  const [participants, setParticipants] = useState([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedTab, setSelectedTab] = useState("chat");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!params?.id) {
        toast.error("Invalid group ID");
        return;
      }
      try {
        setLoading(true);

        const currentParticipant = await getCurrentParticipant(user, params.id);
        setParticipant(currentParticipant);

        //log
        console.log("Participant: ", participant);

        const data = await getGroupById(params.id);
        setGroupDetails(data);

        console.log("Group: ", data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (params?.id ) {
      fetchInitialData();
    }
  }, [user, params?.id]);

  const handleSaveNewProfile = async (newParticipantProfile) => {
    await updateParticipantProfile(
      user?._id,
      groupDetails?._id,
      newParticipantProfile
    );
    setParticipant(newParticipantProfile);
  };

  return loading ? (
    <div className="flex items-center justify-center text-gray-500 h-full w-full">
      Loading...
    </div>
  ) : (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      <div className="flex  items-center justify-between py-2 px-6 ">
        <div className="flex justify-between items-center">
          <Button
            isIconOnly
            variant="light"
            onPress={() => setSidebar(!sidebar)}
          >
            <Bars3Icon className="size-6" />
          </Button>

          <div className="ml-6 text-lg hidden md:block">
            <div>{groupDetails?.name || "Loading..."}</div>
          </div>
        </div>

        <div
          onClick={onOpen}
          className="flex items-center justify-center gap-x-4 px-2 py-1 rounded-xl cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <div>
            {typeof participant?.nickname === "string"
              ? participant.nickname
              : "Unknown Nickname"}
          </div>
          <Avatar
            showFallback
            src={participant?.avatarUrl || null}
            className="w-8 h-8"
          />
        </div>
      </div>

      <div className="flex overflow-y-auto h-screen">
        {sidebar && (
          <GroupInfoSidebar
            currentGroup={groupDetails}
            participants={participants}
            currentParticipant={participant}
          />
        )}

        <div
          className={` flex flex-col  h-full w-full items-center p-1 
            ${sidebar && "hidden md:flex "}`}
        >
          <InteractionsTabs
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />

          <div
            className={`w-full md:max-w-[800px] flex-1 ${
              selectedTab !== "chat" && "hidden"
            }`}
          >
            <GroupChatBox
              participant={participant}
              currentGroup={groupDetails}
              participants={participants}
              setParticipants={setParticipants}
            />
          </div>
        </div>
      </div>

      <GroupParticipantModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        participant={participant}
        onConfirm={async (newParticipantProfile) =>
          await handleSaveNewProfile(newParticipantProfile)
        }
      />
    </div>
  );
};

export default GroupRoom;
