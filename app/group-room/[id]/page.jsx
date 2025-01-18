"use client";

import GroupInfoSidebar from "@/app/_components/GroupInfoSidebar";
import GroupChatBox from "@/app/_components/page-components/groups/GroupChatBox";
import { useAuth } from "@/app/_context/AuthContext";
import { useWebSocket } from "@/app/_context/WebSoketContext";
import { getGroupById } from "@/app/services/groupService";
import { getProfile, updateGuestAlias } from "@/app/services/guestService";

import { Bars3Icon, PencilIcon, UserIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const GroupRoom = () => {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [sidebar, setSidebar] = useState(false);
  const [anonymous, setIdentity] = useState(false);
  const [groupDetails, setGroupDetails] = useState(null); // To store group data
  const [participants, setParticipants] = useState([]);
  const [alias, setAlias] = useState(user?.fullname || "Guest-unknown");
  const { groupSocket } = useWebSocket();
  const [profile, setProfile] = useState(null);

  // Function to update alias and save to localStorage
  const handleAliasChange = (newAlias) => {
    if (newAlias) {
      updateGuestAlias(newAlias);
      setAlias(newAlias);
    } else {
      console.error("Alias cannot be empty");
    }
  };

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (!params?.id) {
        router.push("/");
        return;
      }
      const data = await getGroupById(params.id);
      setGroupDetails(data);

      

      if (groupSocket) {
        groupSocket.emit("joinRoom", { groupId: data._id, username: alias });

        groupSocket.on("updateParticipants", (participants) => {
          setParticipants(participants);
        });
      }
    };

    const profile = getProfile(user); // Preluăm profilul din localStorage
    if (profile && groupSocket) {
      const payload = { groupId: params.id, profile }; // Trimitem profilul complet (id și username)
      groupSocket.emit("joinRoom", payload); // Alăturăm utilizatorul la grup
      setProfile(profile);
    }

    fetchGroupDetails();
    return () => {
      if (groupSocket && params?.id) {
        groupSocket.emit("leaveRoom", { groupId: params.id });
      }
    };
  }, [params?.id, router, groupSocket, alias]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      <div className="flex bg-white dark:bg-gray-900 items-center justify-between py-3 px-6 border-b border-gray-300 dark:border-gray-800">
        <div className="flex justify-between items-center">
          <div onClick={() => setSidebar(!sidebar)}>
            <Bars3Icon className="size-6" />
          </div>

          <div className="ml-6 text-lg hidden md:block">
            <div>{groupDetails?.name || "Loading..."}</div>
          </div>
        </div>

        <div className="">
          {anonymous ? (
            <div
              className="w-8 h-8"
              onClick={() => {
                setIdentity(false);
              }}
            >
              <UserIcon className="p-1" />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-x-4">
              <Popover>
                <PopoverTrigger className="cursor-pointer">
                  {alias || <PencilIcon className="size-4" />}
                </PopoverTrigger>
                <PopoverContent className="max-w-[240px]">
                  {() => (
                    <div className="px-1 py-2 w-full">
                      <div className="mt-2 flex flex-col gap-2 w-full ">
                        <Input
                          maxLength={30}
                          autoFocus
                          value={alias}
                          onChange={(e) => handleAliasChange(e.target.value)}
                          label="Alias"
                          size="sm"
                          variant="default"
                        />
                      </div>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
              <div
                className="w-8 h-8"
                onClick={() => {
                  setIdentity(true);
                }}
              >
                <Avatar
                  showFallback
                  src={user?.avatarUrl || null}
                  className="w-full h-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex overflow-y-auto h-screen">
        {sidebar && (
          <GroupInfoSidebar
            currentGroup={groupDetails}
            participants={participants}
          />
        )}

        <div
          className={`flex justify-center h-full flex-1 
            ${sidebar && "hidden md:flex md:w-1/2 xl:justify-start xl:ml-48"}`}
        >
          <GroupChatBox
            anonymous={anonymous}
            profile={profile}
            currentGroup={groupDetails}
            participants={participants}
            setParticipants={setParticipants}
          />
        </div>
      </div>
    </div>
  );
};

export default GroupRoom;
