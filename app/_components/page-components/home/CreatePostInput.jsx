"use client";
import { useAuth } from "@/app/_context/AuthContext";
import { Avatar, useDisclosure } from "@heroui/react";
import React, { useState, useEffect } from "react";
import InitialsAvatar from "../../InitialsAvatar";
import {
  ChartBarIcon,
  PaintBrushIcon,
  PencilIcon,
  PhotoIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/16/solid";
import CreatePostModal from "../../modals/CreatePostModal";
import { usePanel } from "@/app/_context/PanelContext";

const suggestions = [
  {
    text: "Try drawing something cool!",
    icon: () => (
      <PaintBrushIcon className="size-6  flex-shrink-0 text-yellow-500" />
    ),
  },
  {
    text: "Ask your friends an interesting question!",
    icon: () => (
      <QuestionMarkCircleIcon className="size-6  flex-shrink-0 text-primary" />
    ),
  },
  {
    text: "Share a thought or a moment from your day!",
    icon: () => <PencilIcon className="size-6  flex-shrink-0 text-green-500" />,
  },
  {
    text: "Create a fun poll and see what your friends think!",
    icon: () => (
      <ChartBarIcon className="size-6  flex-shrink-0 text-purple-500" />
    ),
  },
  {
    text: "Express yourself with an image or video!",
    icon: () => <PhotoIcon className="size-6  flex-shrink-0 text-red-500" />,
  },
];

const CreatePostInput = () => {
  const { user } = useAuth();
  const [suggestion, setSuggestion] = useState({ text: "", icon: () => null });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { pushSubPanel, screenSize } = usePanel();

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * suggestions.length);
    setSuggestion(suggestions[randomIndex]);
  }, []);

  return (
    <div
      onClick={() => {
        if (screenSize > 640) {
          onOpen();
        } else {
          pushSubPanel("CreatePost");
        }
      }}
      className="flex flex-col gap-y-4 p-6 w-full border hover:bg-gray-200 dark:hover:bg-gray-800 
      border-gray-200 dark:border-gray-800 rounded-xl cursor-pointer transition duration-150 ease-in"
    >
      {/* Input Section */}
      <div className="flex items-center space-x-4">
        {user?.avatarUrl ? (
          <Avatar size="md" src={user.avatarUrl} />
        ) : (
          <InitialsAvatar nickname={user?.fullname} size={40} />
        )}
        <div className="flex-1  bg-transparent w-full text-gray-500 flex items-center justify-between gap-2">
          {suggestion.text} {suggestion.icon()}
        </div>
      </div>

      <CreatePostModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
};

export default CreatePostInput;
