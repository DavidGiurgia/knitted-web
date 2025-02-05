"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";
import React, { useEffect } from "react";
import ChatBox from "./ChatBox";
import { usePanel } from "@/app/_context/PanelContext";
import ChatLinkItem from "./ChatMembersItem";
import { useKeyboard } from "@/app/_context/KeyboardContext";

const ChatRoom = ({ room, goBack }) => {
  const { pushSubPanel } = usePanel();
  const { isKeyboardOpen, keyboardHeight } = useKeyboard();


  return (
    <div className={`flex flex-col h-full w-full `}>
      <div className="flex w-full justify-between gap-x-2 items-center px-4 py-2 border-b border-gray-300 dark:border-gray-800 md:border-none">
        <Button
          onPress={() => {
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
          <ChatLinkItem room={room} variant={"details"} />
        </div>
      </div>
      <ChatBox room={room} />
    </div>
  );
};

export default ChatRoom;
