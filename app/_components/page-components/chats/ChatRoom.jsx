"use client";

import { ArrowLeftIcon, Bars3Icon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import ChatBox from "./ChatBox";
import { usePanel } from "@/app/_context/PanelContext";
import ChatLinkItem from "./ChatMembersItem";

const ChatRoom = ({ room, goBack }) => {
  const { setBottombar, pushSubPanel } = usePanel();

  useEffect(() => {
    setBottombar(false);
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex w-full justify-between gap-x-2 items-center px-4 py-2 border-b border-gray-300 dark:border-gray-800 md:border-none">
        <Button
          onPress={() => {
            setBottombar(true);
            goBack();
          }}
          variant="light"
          isIconOnly
        >
          <ArrowLeftIcon className="size-5" />
        </Button>
        <div
          className="hover:bg-gray-100 dark:hover:bg-gray-800 flex-1 cursor-pointer rounded-lg px-2"
          onClick={() => {
            pushSubPanel("Profile", null); ////// to implement      !!!!!
          }}
        >
          <ChatLinkItem room={room} variant={"details"}/>
        </div>
      </div>
      <ChatBox room={room} />
    </div>
  );
};

export default ChatRoom;
