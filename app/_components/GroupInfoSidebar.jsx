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
import { useState } from "react";
import {
  Avatar,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import UpdateGroupModal from "./modals/UpdateGroupModal";

const GroupInfoSidebar = ({ currentGroup, participants, currentParticipant }) => {
  const { user } = useAuth();
  const isCreator = currentGroup?.creatorId === user?._id;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  const formattedGroupLifetime = () => {
    if (!currentGroup?.createdAt || !currentGroup?.expiresAt) {
      return "Unknown range date";
    }

    const createdAt = new Date(currentGroup.createdAt);
    const expiresAt = new Date(currentGroup.expiresAt);

    // Check if both dates are in the same month and year
    if (format(createdAt, "MMM yyyy") === format(expiresAt, "MMM yyyy")) {
      return `${format(createdAt, "MMM d")} - ${format(expiresAt, "d, yyyy")}`;
    }

    // If they are not in the same month/year
    return `${format(createdAt, "MMM d, yyyy")} - ${format(
      expiresAt,
      "MMM d, yyyy"
    )}`;
  };

  return (
    <div className="overflow-y-auto overflow-x-hidden flex flex-col h-full w-full md:w-fit md:max-w-80">
      <div
        onClick={isCreator ? onOpen : null}
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
          {currentGroup?.description || (
            <i className={`${!isCreator && "hidden"}`}>
              Add a description
            </i>
          )}
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
              {formattedGroupLifetime()}
            </div>
          </PopoverTrigger>
          <PopoverContent className="">
            <div>edit end date</div>
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

        <div
          onClick={() => setShowParticipants(!showParticipants)}
          className="flex items-center gap-x-4 hover:text-primary cursor-pointer"
        >
          <UsersIcon className="size-5" />
          {participants?.length || 0} online participants
        </div>

        {showParticipants && (
          <div className="flex flex-col bg-white dark:bg-gray-800 p-4 rounded-lg gap-y-2">
            <h3 className="text-lg font-semibold">{'Participants '}</h3>
            <ul className="flex flex-col gap-y-1">
              {participants && participants.length > 0 ? (
                participants?.map((participant) => (
                  <li
                    key={participant.id}
                    className="text-sm flex gap-x-2 items-center py-1 px-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <Avatar
                    size="sm"
                      //src={participant.avatarUrl}
                      className="flex-shrink-0"
                    />
                    <div>
                      {participant.nickname}
                      {participant.id === currentParticipant.id && <div>(You)</div>}
                    </div>
                  </li>
                ))
              ) : (
                <p>No participants yet</p>
              )}
            </ul>
          </div>
        )}

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

        {!user && (
          <div className="w-full">
            <Button
              onPress={() => window.open("/register", "_blank")}
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

      <UpdateGroupModal
        group={currentGroup}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};

export default GroupInfoSidebar;
