"use client";

import {
  CalendarDaysIcon,
  ClockIcon,
  HashtagIcon,
  LockClosedIcon,
  MoonIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../_context/AuthContext";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { format } from "date-fns";
import { getUserById } from "../services/userService";
import { useEffect, useState } from "react";
import CustomModal from "./modals/CustomModal";
import { deleteGroup } from "../services/groupService";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import GroupModal from "./modals/GroupModal";
import UserProfile from "./UserProfile";
import ProfileCard from "./ProfileCard";

const GroupInfoSidebar = ({ currentGroup, participants }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [creator, setCreator] = useState(null);
  const isCreator = currentGroup?.creatorId === user?._id;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModaOpen,
    onOpenChange: onDeleteModaOpenChange,
  } = useDisclosure();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    const getCreator = async () => {
      try {
        const creator = await getUserById(currentGroup?.creatorId);
        setCreator(creator);
      } catch (error) {
        console.error("Error fetching creator:", error);
      }
    };

    if (currentGroup?.creatorId) {
      getCreator();
    }
  }, [currentGroup]);

  // Format the createdAt value
  const formattedCreatedAt = currentGroup?.createdAt
    ? format(new Date(currentGroup.createdAt), "d MMM")
    : "Unknown date";

  return (
    <div className="overflow-y-auto overflow-x-hidden flex flex-col h-full w-full md:w-fit md:max-w-80">
      <div
        onClick={onOpen}
        className="cursor-pointer pt-6 px-6 pb-4 w-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
      >
        <div className="font-medium text-lg mb-2">
          {currentGroup?.name || "Group Name"}
        </div>
        <div
          className={`text-sm text-[#808080] text-pretty ${
            isExpanded ? "" : "line-clamp-3"
          }`}
        >
          {currentGroup?.description || (<i>Tap to add a description</i>)}

          
        </div>
        {currentGroup?.description?.length > 200 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpanded();
            }}
            className="mt-2 text-primary hover:underline text-sm"
          >
            {isExpanded ? "Hide" : "Read more"}
          </button>
        )}
      </div>
      <div className="p-6 flex flex-col gap-y-8">
        <Popover className="">
          <PopoverTrigger>
            <div className="flex items-center gap-x-4 hover:text-primary cursor-pointer">
              <CalendarDaysIcon className="size-5 flex-shrink-0" />
              {`Created by ${
                creator?.username || "Unknown"
              } at ${formattedCreatedAt}`}
            </div>
          </PopoverTrigger>
          <PopoverContent className="">
            <ProfileCard currentUser={creator} />
          </PopoverContent>
        </Popover>

        <Tooltip content="Copy" placement="right" showArrow>
          <div
            onClick={() => {
              if (currentGroup?.joinCode) {
                navigator.clipboard.writeText(currentGroup.joinCode);
                toast.success("Join code copied to clipboard!");
              } else {
                toast.error("No join code available to copy.");
              }
            }}
            className={`w-fit flex gap-x-4 items-center hover:text-primary cursor-pointer`}
          >
            <HashtagIcon className="size-5" />
            {currentGroup?.joinCode || "No code"}
          </div>
        </Tooltip>

        <div className="flex items-center gap-x-4 hover:text-primary">
          <UsersIcon className="size-5" />
          {participants.length || 0} online participants
        </div>

        <div className="participant-list bg-white dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-bold">Participants</h3>
          <ul>
            {participants && participants.length > 0 ? (
              participants?.map((participant) => (
                <li
                  key={participant.id}
                  className="py-1 px-2 rounded hover:bg-gray-200"
                >
                  {participant.username}
                </li>
              ))
            ) : (
              <p>No participants yet</p>
            )}
          </ul>
        </div>

        <hr className="h-px border-gray-500  transform scale-y-50" />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MoonIcon className="size-5 mr-4" />
            Dark mode
          </div>
          <ThemeSwitcher />
        </div>

        <hr className="h-px border-gray-500 transform scale-y-50" />

        <div className="flex items-center cursor-pointer">
          <LockClosedIcon className="size-5 ml-2 mr-5 flex-shrink-0" />
          <div>
            Encryption
            <p className="text-sm text-[#808080]">
              Messages are end-to-end encrypted. Click to learn more.
            </p>
          </div>
        </div>

        <div className="flex items-center cursor-pointer">
          <ClockIcon className="size-5 ml-2 mr-5 flex-shrink-0" />
          <div>
            Temporary
            <p className="text-sm text-[#808080]">
              Once the session ends, so does the data. Click to learn more.
            </p>
          </div>
        </div>

        <div
          onClick={onDeleteModaOpen}
          className={`cursor-pointer !text-red-500 ${!isCreator && "hidden"}`}
        >
          Delete group
        </div>

        {!user && (
          <div className="w-full">
            <Button
              onClick={() => window.open("/register", "_blank")}
              className="w-full"
              size="lg"
              variant="bordered"
              color="primary"
            >
              Try ZIC for more
            </Button>
          </div>
        )}
      </div>

      <GroupModal
        group={currentGroup}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />

      <CustomModal
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModaOpenChange}
        title="Delete Group"
        body={`Are you sure you want to delete group "${currentGroup?.name}"? This action cannot be undone.`}
        confirmButtonText="Delete"
        confirmButtonColor="danger"
        cancelButtonText="Cancel"
        onConfirm={async () => {
          // Perform deletion logic here
          await deleteGroup(currentGroup?._id);
          router.push("/");
          toast.success("Group deleted successfully");
        }}
      />
    </div>
  );
};

export default GroupInfoSidebar;
