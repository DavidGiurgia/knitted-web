"use client";

import ChatBox from "@/app/_components/ChatBox";
import GroupInfoSidebar from "@/app/_components/GroupInfoSidebar";
import { useAuth } from "@/app/_context/AuthContext";
import { getGroupById } from "@/app/services/groupService";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const GroupRoom =  () => {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [sidebar, setSidebar] = useState(false);
  const [anonymous, setIdentity] = useState(false);
  const [groupDetails, setGroupDetails] = useState(null); // To store group data
  const [onlineUsers, setOnlineUsers] = useState(0);

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
      <div className="flex bg-white dark:bg-gray-900 items-center justify-between py-4 px-6 border-b border-gray-300 dark:border-gray-800">
        <div className="flex justify-between">
          <div onClick={() => setSidebar(!sidebar)}>
            <Bars3Icon className="size-6" />
          </div>

          <div className="ml-6 text-lg">
            {groupDetails ? groupDetails.name : "Loading..."}
          </div>
        </div>

        {anonymous ? (
          <div
            onClick={() => {
              setIdentity(!anonymous);
            }}
            className=""
          >
            <div className="avatar" />
          </div>
        ) : (
          <div className="flex items-center ">
            <div>
              <div>avatar</div>
            </div>
          </div>
        )}
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
          <ChatBox />
        </div>
      </div>
    </div>
  );
};

export default GroupRoom;
