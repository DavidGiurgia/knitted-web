"use client";
import {
  BellIcon,
  ChevronDownIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  useDisclosure,
} from "@heroui/react";
import Image from "next/image";
import React from "react";
import CreatePostModal from "../../modals/CreatePostModal";
import { usePanel } from "@/app/_context/PanelContext";

const FeedHeader = ({ switchPanel }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { screenSize, pushSubPanel } = usePanel();
  return (
    <div className="bg-white dark:bg-gray-950 w-full flex items-center justify-between px-4 py-1 md:hidden border-b border-gray-300 dark:border-gray-800">
      <Image
        alt="logo"
        src="/assets/ZIC-logo.svg"
        width={42}
        height={40}
        className=""
      />
      <div className="flex items-center gap-x-1">
        <Button
          variant="light"
          isIconOnly
          onPress={() => {
            if (screenSize > 640) {
              onOpenCreatePost();
            } else {
              pushSubPanel("CreatePost");
            }
          }}
        >
          <PlusIcon className="size-6" />
        </Button>
        <Button
          variant="light"
          isIconOnly
          onPress={() => {
            switchPanel("Notifications");
          }}
          className=" rounded-lg "
        >
          <BellIcon className="size-6" />
        </Button>
      </div>

      <CreatePostModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
};

export default FeedHeader;
