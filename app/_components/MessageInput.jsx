"use client";

import { useRef, useEffect } from "react";
import { FaceSmileIcon } from "@heroicons/react/24/outline";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/react";

const MessageInput = ({ message, setMessage }) => {
  const textareaRef = useRef(null);

  const handleEmojiSelect = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.native);
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Resetează înălțimea
      textarea.style.height = `${Math.min(textarea.scrollHeight, 112)}px`; // Ajustează în funcție de conținut (96px = 4 rânduri)
    }
  };

  useEffect(() => {
    adjustTextareaHeight(); // Ajustează înălțimea la fiecare modificare a mesajului
  }, [message]);

  return (
    <div className="w-full">
      {/* Input pentru mesaj și butonul de emoji */}
      <div className="flex min-h-12 items-center w-full rounded-[20px] border border-gray-200 dark:border-gray-800 pl-1">
        <Popover className="overflow-auto max-w-screen">
          <PopoverTrigger>
            <button className="p-2 text-gray-500 dark:text-white hover:text-primary hover:dark:text-primary">
              <FaceSmileIcon className="size-6" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="max-w-sm overflow-auto ">
            <Picker
              data={data}
              onEmojiSelect={handleEmojiSelect}
              theme={localStorage.getItem("theme")}
            />
          </PopoverContent>
        </Popover>

        <textarea
          ref={textareaRef} // Referința către textarea
          rows={1}
          maxLength={1000}
          placeholder={`Type your message`}
          className="w-full py-1 resize-none bg-transparent border-none outline-none focus:ring-0 text-gray-800 dark:text-gray-100 overflow-y-auto"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onInput={adjustTextareaHeight} // Ajustează înălțimea în timpul scrierii
        />
      </div>
    </div>
  );
};

export default MessageInput;
