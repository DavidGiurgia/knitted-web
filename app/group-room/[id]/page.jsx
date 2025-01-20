"use client";

import GroupInfoSidebar from "@/app/_components/GroupInfoSidebar";
import GroupProfileModal from "@/app/_components/modals/GroupProfileModal";
import GroupChatBox from "@/app/_components/page-components/groups/GroupChatBox";
import { useAuth } from "@/app/_context/AuthContext";
import { useWebSocket } from "@/app/_context/WebSoketContext";
import { getGroupById } from "@/app/services/groupService";
import { getProfile, updateProfile } from "@/app/services/guestService";

import { Bars3Icon } from "@heroicons/react/24/outline";
import { Avatar, useDisclosure } from "@nextui-org/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const GroupRoom = () => {
  const { user } = useAuth();
  const { groupSocket } = useWebSocket();
  const params = useParams();
  const [sidebar, setSidebar] = useState(false);
  const [groupDetails, setGroupDetails] = useState(null); // To store group data
  const [participants, setParticipants] = useState([]);
  const [profile, setProfile] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const currentProfile = getProfile(user, params?.id);
        if (!currentProfile) {
          toast.error("Failed to fetch profile");
          return;
        }

        setProfile(currentProfile);
        console.log("profile created: " + profile);

        emitUpdateProfile(currentProfile);

        if (!params?.id) {
          toast.error("Invalid group ID");
          return;
        }

        const data = await getGroupById(params.id);
        setGroupDetails(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Something went wrong. Please try again.");
      }
    };

    fetchInitialData();
  }, [user, params?.id]);

  const handleSaveProfile = (newProfile) => {
    updateProfile(newProfile, params?.id);
    setProfile(newProfile);

    emitUpdateProfile(newProfile);
  };

  const emitUpdateProfile = (newProfile) => {

    if(!newProfile || !groupSocket) {
      console.log("profile or group socket is null");
      return;
    }

     //log 
     console.log("Profile updated to be saved: ", newProfile);
     console.log("groupID: ", params.id);

    groupSocket.emit("updateProfile", {
      groupId: params.id,
      profile: {
        id: newProfile.id,
        username: newProfile.username,
        avatarUrl: newProfile.avatarUrl,
      },
    });

   
  };

  return !params?.id ? (
    <div className="flex items-center justify-center text-gray-500 h-full w-full">
      This group is unavailable
    </div>
  ) : (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      <div className="flex bg-white dark:bg-gray-900 items-center justify-between py-2 px-6 border-b border-gray-300 dark:border-gray-800">
        <div className="flex justify-between items-center">
          <div onClick={() => setSidebar(!sidebar)}>
            <Bars3Icon className="size-6" />
          </div>

          <div className="ml-6 text-lg hidden md:block">
            <div>{groupDetails?.name || "Loading..."}</div>
          </div>
        </div>

        <div
          onClick={onOpen}
          className="flex items-center justify-center gap-x-4 px-2 py-1 rounded-xl cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <div>{profile?.username}</div>
          <Avatar
            showFallback
            src={profile?.avatarUrl || null}
            className="w-8 h-8"
          />
        </div>
      </div>

      <div className="flex overflow-y-auto h-screen">
        {sidebar && (
          <GroupInfoSidebar
            currentGroup={groupDetails}
            participants={participants}
            profile={profile}
          />
        )}

        <div
          className={`flex justify-center h-full flex-1 
            ${sidebar && "hidden md:flex md:w-1/2 xl:justify-start xl:ml-48"}`}
        >
          <GroupChatBox
            profile={profile}
            currentGroup={groupDetails}
            participants={participants}
            setParticipants={setParticipants}
          />
        </div>
      </div>

      <GroupProfileModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        profile={profile}
        setProfile={setProfile}
        onConfirm={(newProfile) => handleSaveProfile(newProfile)}
      />
    </div>
  );
};

export default GroupRoom;
