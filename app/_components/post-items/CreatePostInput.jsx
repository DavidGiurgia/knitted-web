"use client";
import { useAuth } from "@/app/_context/AuthContext";
import { Avatar, useDisclosure } from "@heroui/react";
import React, { useState } from "react";
import InitialsAvatar from "../InitialsAvatar";
import { ChartBarIcon, UserIcon } from "@heroicons/react/16/solid";
import CreatePostModal from "./CreatePostModal";
import { usePanel } from "@/app/_context/PanelContext";
import { BookImage } from "lucide-react";

const CreatePostInput = () => {
  const { user } = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { pushSubPanel, screenSize } = usePanel();
  const [initialTab, setInitialTab] = useState("default");

  return (
    <div
      className="flex flex-col  gap-y-4 p-2 md:p-4 w-full border-b  md:border md:rounded-xl
      border-gray-200 dark:border-gray-800  "
    >
      {/* Input Section */}
      <div className="flex items-center space-x-4">
        {user?.avatarUrl ? (
          <Avatar size="md" src={user.avatarUrl} />
        ) : (
          <InitialsAvatar nickname={user?.fullname} size={40} />
        )}
        <div
          onClick={() => {
            setInitialTab("default");
            if (screenSize > 640) {
              onOpen();
            } else {
              pushSubPanel("CreatePost", "default");
            }
          }}
          className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 flex-1 py-2 px-4 border border-gray-200 dark:border-gray-800 rounded-full bg-transparent w-full text-gray-500 flex items-center justify-between gap-2"
        >
          Write something...
        </div>
      </div>

      <div className=" flex items-center w-full gap-2 overflow-x-auto scrollbar-hide">
        <div
          onClick={() => {
            setInitialTab("anonymous");
            if (screenSize > 640) {
              onOpen();
            } else {
              pushSubPanel("CreatePost", "anonymous");
            }
          }}
          className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 flex flex-shrink-0 items-center gap-1 text-xs border border-gray-200 dark:border-gray-800 rounded-full w-fit py-2 px-4"
        >
          <UserIcon className="size-4 " /> Anonymous post
        </div>
        <div
          onClick={() => {
            setInitialTab("upload");
            if (screenSize > 640) {
              onOpen();
            } else {
              pushSubPanel("CreatePost", "upload");
            }
          }}
          className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 flex flex-shrink-0 items-center gap-1 text-xs border border-gray-200 dark:border-gray-800 rounded-full w-fit py-2 px-4"
        >
          <BookImage size={16} strokeWidth={1} absoluteStrokeWidth /> Photo/Video
        </div>
        <div
          onClick={() => {
            setInitialTab("poll");
            if (screenSize > 640) {
              onOpen();
            } else {
              pushSubPanel("CreatePost", "poll");
            }
          }}
          className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 flex flex-shrink-0 items-center gap-1 text-xs border border-gray-200 dark:border-gray-800 rounded-full w-fit py-2 px-4"
        >
          <ChartBarIcon className="size-4 " /> Poll
        </div>
      </div>

      <CreatePostModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        initialTab={initialTab}
      />
    </div>
  );
};

export default CreatePostInput;
