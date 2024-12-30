"use client";

import { Avatar, Badge, Button } from "@nextui-org/react";
import React from "react";
import { useAuth } from "../_context/AuthContext";
import { usePanel } from "../_context/PanelContext";

const ProfileCard = ({ currentUser }) => {
  const { user } = useAuth();
  const { pushSubPanel } = usePanel();

  return (
    <div className="p-3 w-full max-w-sm mx-auto  rounded-lg shadow-md">
      <div className="flex flex-wrap gap-x-4 gap-y-2 ">
        <Badge
          size="sm"
          color="primary"
          content="You"
          isInvisible={user?._id !== currentUser?._id}
          className="rounded-lg border-white dark:border-gray-800 "
          placement="bottom-right"
        >
          <Avatar
            showFallback
            src={currentUser?.avatarUrl}
            className="w-16 h-16 text-lg"
          />
        </Badge>
        <div className="flex-1">
          <div className="text-lg font-medium text-gray-900 dark:text-white">
            {currentUser?.fullname || currentUser?.username || "Unknown"}
          </div>
          <div className="text-gray-500 text-sm ">{currentUser?.email}</div>
        </div>
      </div>

      <div className="flex flex-col mt-4 gap-y-4">
        <div className="flex gap-x-3">
          <div className="flex items-center gap-1">
            <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
              4
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Friends</p>
          </div>
          <div className="flex items-center gap-1">
            <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
              97.1K
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Posts</p>
          </div>
        </div>
        <Button
          onPress={() => {
            pushSubPanel("Profile", currentUser);
          }}
          size="sm"
          color="primary"
          className="w-full"
        >
          View profile
        </Button>
      </div>
    </div>
  );
};

export default ProfileCard;
