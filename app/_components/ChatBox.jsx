'use client'

import { useState } from "react";
import MessageInput from "./MessageInput";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

const ChatBox = () => {
  const [message, setMessage] = useState("");

  const handleEmojiSelect = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji);
  };

  return (
    <div className="flex p-2 flex-col items-center h-full w-full md:w-[600px]">
      <div className="flex flex-1 overflow-y-auto">messages</div>

      <div className="flex w-full items-end gap-x-2 ">
        <MessageInput
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onEmojiSelect={handleEmojiSelect}
        />

        <button className="!bg-primary hover:!bg-light-bg-2 size-12 flex-shrink-0 flex justify-center items-center rounded-xl">
          <PaperAirplaneIcon className="size-6 " />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
