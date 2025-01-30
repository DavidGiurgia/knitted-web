"use client";

import {
  CalendarDaysIcon,
  HashtagIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../_context/AuthContext";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { format } from "date-fns";
import { useState } from "react";
import {
  Button,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import toast from "react-hot-toast";
import UpdateGroupModal from "./modals/UpdateGroupModal";

const GroupInfoSidebar = ({
  currentGroup
}) => {
  const { user } = useAuth();
  const isCreator = currentGroup?.creatorId === user?._id;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isExpanded, setIsExpanded] = useState(false);

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
    return `${format(createdAt, "MMM d")} - ${format(
      expiresAt,
      "d, yyyy"
    )}`;
  };

  return (
    <div className="overflow-y-auto overflow-x-hidden fixed flex flex-col h-full w-full md:w-fit md:max-w-80">
      <div
        onClick={isCreator ? onOpen : null}
        className="cursor-pointer pt-6 px-6 pb-4 w-full  hover:bg-gray-200 dark:hover:bg-gray-800"
      >
        <div className="font-medium mb-2">
          {currentGroup?.name || "Group Name"}
        </div>
        <div
          className={`text-sm text-[#808080] text-pretty ${
            isExpanded ? "" : "line-clamp-3"
          }`}
        >
          {currentGroup?.description || (
            <i className={`${!isCreator && "hidden"}`}>Add a description</i>
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
        <div
          onClick={isCreator ? onOpen : null}
          className="flex text-sm items-center gap-x-4 hover:text-primary cursor-pointer"
        >
          <CalendarDaysIcon className="size-5 flex-shrink-0" />
          {formattedGroupLifetime()}
        </div>

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
            className={`w-fit text-sm flex gap-x-4 items-center hover:text-primary cursor-pointer`}
          >
            <HashtagIcon className="size-5" />
            {currentGroup?.joinCode || "No code"}
          </div>
        </Tooltip>

      
        <hr className="h-px border-gray-500  transform scale-y-50" />

        <div className="flex text-sm items-center justify-between">
          <div className="flex items-center">
            <MoonIcon className="size-5 mr-4" />
            Dark mode
          </div>
          <ThemeSwitcher />
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
