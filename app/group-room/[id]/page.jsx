"use client";

import ChatBox from "@/app/_components/ChatBox";
import GroupInfoSidebar from "@/app/_components/GroupInfoSidebar";
import { useAuth } from "@/app/_context/AuthContext";
import { getGroupById } from "@/app/services/groupService";
import {
  Bars3Icon,
  EyeSlashIcon,
  FingerPrintIcon,
  NoSymbolIcon,
  PencilIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
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
  const { user, isAuthenticated } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [sidebar, setSidebar] = useState(false);
  const [anonymous, setIdentity] = useState(false);
  const [groupDetails, setGroupDetails] = useState(null); // To store group data
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [alias, setAlias] = useState(user?.username || "");

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        if (!params?.id) {
          console.error("No group ID found in URL params.");
          router.push("/"); // Redirecționează dacă id-ul lipsește
          return;
        }

        const data = await getGroupById(params.id);
        setGroupDetails(data); // Populate group details
      } catch (error) {
        console.error("Error fetching group details:", error);
        toast.error("Failed to load group details.");
      }
    };

    fetchGroupDetails();
  }, [params?.id, router]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      <div className="flex bg-white dark:bg-gray-900 items-center justify-between py-3 px-6 border-b border-gray-300 dark:border-gray-800">
        <div className="flex justify-between items-center">
          <div onClick={() => setSidebar(!sidebar)}>
            <Bars3Icon className="size-6" />
          </div>

          <div className="ml-6 text-lg hidden md:block">
            {groupDetails ? groupDetails.name : "Loading..."}
          </div>
        </div>

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
                      onChange={(e) => setAlias(e.target.value)}
                      label="Alias"
                      size="sm"
                      variant="default"
                    />
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>

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
            <div
              className="w-8 h-8"
              onClick={() => {
                setIdentity(true);
              }}
            >
              <Avatar
                showFallback
                src={isAuthenticated ? user?.avatarUrl : null}
                className="w-full h-full"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex overflow-y-auto h-screen">
        {sidebar && (
          <GroupInfoSidebar
            currentGroup={groupDetails}
            onlineCount={onlineUsers}
          />
        )}

        <div
          className={`flex justify-center h-full flex-1 
            ${sidebar && "hidden md:flex md:w-1/2 xl:justify-start xl:ml-48"}`}
        >
          <ChatBox room={null} />
        </div>
      </div>
    </div>
  );
};

export default GroupRoom;
