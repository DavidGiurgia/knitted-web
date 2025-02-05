"use client";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import InitialsAvatar from "../../InitialsAvatar";
import { useAuth } from "@/app/_context/AuthContext";
import { usePanel } from "@/app/_context/PanelContext";

const CreatePostSection = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [anonymously, setAnonymously] = useState(false);
  const { popSubPanel} = usePanel();

  return (
    <div className="flex flex-col ">
      {/* Header */}
      <div className="flex items-center p-2 gap-x-2 flex-shrink-0 border-b border-gray-300 dark:border-gray-700">
        <Button onPress={popSubPanel} variant="light" isIconOnly>
          <ArrowLeftIcon className="size-5" />
        </Button>
        <div className="font-semibold text-lg">Create Post</div>

        <Button
          size="sm"
          isLoading={loading}
          color="primary"
          className="ml-auto"
        >
          Post
        </Button>
      </div>
      <div className="p-4 flex flex-col gap-y-4">
        <div className=" flex items-center gap-x-2 ">
          <div className="cursor-pointer">
            {anonymously ? (
              <div
                onClick={() => {
                  setAnonymously(false);
                }}
                className="w-[56px] h-[56px] flex-shrink-0"
              >
                <UserIcon className=" p-2 rounded-full border border-gray-200 dark:border-gray-800" />
              </div>
            ) : (
              <div
                onClick={() => {
                  setAnonymously(true);
                }}
              >
                {user?.avatarUrl ? (
                  <Avatar size="lg" src={user.avatarUrl} />
                ) : (
                  <InitialsAvatar nickname={user?.fullname} size={56} />
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col ">
            <div className="text-gray-800 dark:text-gray-200 text-lg">
              {anonymously ? "Anonymous" : user?.fullname}
            </div>
            <div className="flex items-center gap-x-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    size="sm"
                    variant="flat"
                    className="text-xs text-gray-500 font-thin flex items-center gap-x-2"
                  >
                    <UsersIcon className="size-4 " />
                    Friends
                    <ChevronDownIcon className="size-4 " />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem>Friends</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>
        <div className="overflow-y-auto">
          <textarea
            className="w-full py-1 resize-none bg-transparent border-none outline-none focus:ring-0 text-gray-800 dark:text-gray-100 overflow-y-auto"
            rows={8}
            maxLength={1000}
            placeholder={`What do you want to talk about?`}
          />
        </div>
      </div>
    </div>
  );
};

export default CreatePostSection;
