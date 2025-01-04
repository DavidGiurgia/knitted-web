"use client";

import { useState } from "react";
import MessageInput from "./MessageInput";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { Button } from "@nextui-org/react";

const ChatBox = () => {
  const [message, setMessage] = useState("");

  const handleEmojiSelect = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji);
  };

  return (
    <div className="flex flex-col p-2 h-full items-center w-full max-w-[600px]">
      <div className=" flex-1">messages</div>

      <div className="flex w-full items-end gap-x-2 ">
        <MessageInput
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onEmojiSelect={handleEmojiSelect}
        />

        <Button isIconOnly color="primary" className="h-12 w-12 flex-shrink-0 ">
          <PaperAirplaneIcon className="size-6 dark:text-black" />
        </Button>
      </div>
    </div>
  );
};

export default ChatBox;
