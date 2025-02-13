"use client";

import GroupInfoSidebar from "@/app/_components/GroupInfoSidebar";
import InitialsAvatar from "@/app/_components/InitialsAvatar";
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
import { Button, useDisclosure } from "@heroui/react";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const GroupRoom = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const params = useParams();
  const [sidebar, setSidebar] = useState(false);
  const [group, setGroupDetails] = useState(null);
  const [participant, setParticipant] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedTab, setSelectedTab] = useState("chat");
  const [fetchingData, setFetchingData] = useState(false);
  const [dismissable, setDismissable] = useState(true);

  const [groupSocket, setGroupSocket] = useState(null);

  useEffect(() => {
    const groupWs = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}/group`);

    groupWs.on("connect", () => {
      console.log("Connected to Group WebSocket");
      setGroupSocket(groupWs);
    });

    return () => {
      groupWs.disconnect();
    };
  }, []);

  useEffect(() => {
    if (loading) return; // Wait for auth loading to complete

    if (!isAuthenticated) {
      setDismissable(false);
      onOpen();
    }

    const fetchInitialData = async () => {
      try {
        setFetchingData(true);

        const currentParticipant = await getCurrentParticipant(user, params.id);
        setParticipant(currentParticipant);

        const data = await getGroupById(params.id);
        setGroupDetails(data);

        if (data && groupSocket?.connected) {
          groupSocket.emit("joinRoom", {
            groupId: data._id,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setFetchingData(false);
      }
    };

    if (params?.id && groupSocket) {
      fetchInitialData();
    }
  }, [user, params?.id, groupSocket, loading]);

  const handleSaveNewProfile = async (newParticipantProfile) => {
    await updateParticipantProfile(
      user?._id,
      group?._id,
      newParticipantProfile
    );
    setParticipant(newParticipantProfile);
    setDismissable(true);
  };

  if (loading || fetchingData) {
    return (
      <div className="flex items-center justify-center text-gray-500 h-full w-full">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      <div className=" flex flex-col gap-y-2 borderbg-b py-2 px-3 md:px-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex  items-center justify-between ">
          <Button
            isIconOnly
            variant="light"
            onPress={() => setSidebar(!sidebar)}
          >
            <Bars3Icon className="size-6" />
          </Button>

          <div className="md:ml-6 text-lg">
            <div>{group?.name || "Loading..."}</div>
          </div>

          <div onClick={onOpen} className="flex-shrink-0 md:ml-auto ">
            <InitialsAvatar nickname={participant?.nickname || "U"} size={36} />
          </div>
        </div>

        {!sidebar && (
          <div className=" md:hidden flex-1 ">
            <InteractionsTabs
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          </div>
        )}
      </div>

      <div className="flex overflow-y-auto h-screen">
        {sidebar && (
          <GroupInfoSidebar
            currentGroup={group}
            currentParticipant={participant}
          />
        )}

        <div
          className={`flex flex-col h-full w-full items-center  ${
            sidebar && "hidden md:flex"
          }`}
        >
          <div
            className={`flex justify-center w-full h-full flex-1 overflow-hidden ${
              selectedTab !== "chat" && "hidden"
            }`}
          >
            <GroupChatBox
              participant={participant}
              group={group}
              groupSocket={groupSocket}
            />
          </div>
          <div
            className={`flex justify-center w-full h-full flex-1 overflow-hidden ${
              selectedTab !== "q&a" && "hidden"
            }`}
          ></div>
        </div>

        <div className="hidden md:flex p-4  justify-center">
          <InteractionsTabs
          isVertical
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </div>
      </div>

      <GroupParticipantModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        participant={participant}
        onConfirm={handleSaveNewProfile}
        dismissable={dismissable}
      />
    </div>
  );
};

export default GroupRoom;
