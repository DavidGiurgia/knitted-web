"use client";

import { CalendarDaysIcon, ClockIcon, HashtagIcon, LockClosedIcon, MoonIcon, UsersIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../_context/AuthContext";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { format } from "date-fns";

const GroupInfoSidebar = ({ currentGroup, onlineCount }) => {
  const { user } = useAuth();
  const isCreator = currentGroup?.creatorId === user?._id

  // Format the createdAt value
  const formattedCreatedAt = currentGroup?.createdAt
    ? format(new Date(currentGroup.createdAt), "d MMM")
    : "Unknown date";

  const handleGroupDetailsClick = () => {};

  const handleUpdateNameAndDesc = async () => {};

  const openDeleteModal = async () => {};

  return (
    <div className="overflow-y-auto flex flex-col h-full w-full md:w-fit md:max-w-80">
      <div
        onClick={() => {}}
        className="pt-6 px-6 pb-4 w-full bg-[#F0f0f0] dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
      >
        <div className="font-medium text-lg mb-2">
          {currentGroup?.name || "Group Name"}
        </div>
        <div className="text-sm text-[#808080]">
          {currentGroup?.description}
        </div>
      </div>
      <div className="p-6 flex flex-col gap-y-8">
        <div className="flex items-center gap-x-4 hover:text-primary">
          <CalendarDaysIcon className="size-5" />
          {`Created by ${
            currentGroup?.creatorId || "Unknown"
          } at ${formattedCreatedAt}`}
        </div>

        <div
          className={`w-fit flex gap-x-4 items-center hover:text-primary cursor-pointer`}
        >
          <HashtagIcon className="size-5" />
        </div>

        <div className="flex items-center gap-x-4 hover:text-primary">
          <UsersIcon className="size-5" />
          {onlineCount} online participants
        </div>

        <hr className="h-px bg-gray-neutre transform scale-y-50" />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MoonIcon className="size-5 mr-4" />
            Dark mode
          </div>
          <ThemeSwitcher />
        </div>

        <hr className="h-px bg-gray-neutre transform scale-y-50" />

        <div className="flex items-center">
          <LockClosedIcon className="size-5 ml-2 mr-5 flex-shrink-0" />
          <div>
            Encryption
            <p className="text-sm text-[#808080]">
              Messages are end-to-end encrypted. Click to learn more.
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <ClockIcon className="size-5 ml-2 mr-5 flex-shrink-0" />
          <div>
            Temporary
            <p className="text-sm text-[#808080]">
              Once the session ends, so does the data. Click to learn more.
            </p>
          </div>
        </div>

        <div
          onClick={openDeleteModal}
          className={`!text-red-500 ${!isCreator && "hidden"}`}
        >
          Delete group
        </div>

        {!user && (
          <div className="w-full">
            <button
              onClick={() => window.open("/sign-up", "_blank")}
              className="border-primary mt-4 hover:border-black hover:text-black border dark:hover:text-light-bg dark:hover:border-light-bg text-primary text-lg font-medium py-2 rounded-full w-full"
            >
              Try ZIC for more
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupInfoSidebar;
