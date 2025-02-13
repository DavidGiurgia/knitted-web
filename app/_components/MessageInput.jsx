"use client";

import { useRef, useEffect, useState } from "react";
import { FaceSmileIcon } from "@heroicons/react/24/outline";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { PaperAirplaneIcon, UserIcon } from "@heroicons/react/16/solid";
import toast from "react-hot-toast";
import InitialsAvatar from "./InitialsAvatar";
import { useKeyboard } from "../_context/KeyboardContext";

const MessageInput = ({
  senderName,
  anonymousMode = false,
  anonymous = false,
  setAnonymous,
  message,
  setMessage,
  handleSendMessage,
}) => {
  const textareaRef = useRef(null);
  const { isKeyboardOpen, keyboardHeight } = useKeyboard();
  const [theme, setTheme] = useState("light");

  const handleEmojiSelect = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.native);
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset the height
      textarea.style.height = `${Math.min(textarea.scrollHeight, 112)}px`; // Adjust based on content (96px = 4 rows)
    }
  };

  useEffect(() => {
    adjustTextareaHeight(); // Adjust height on every message change
  }, [message]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") || "light";
      setTheme(savedTheme);
    }
  }, []);

  return (
    <div className="p-1 w-full flex items-center gap-x-2">
      {anonymousMode && (
        <div>
          {anonymous ? (
            <div
              onClick={() => {
                setAnonymous(false);
                toast(`You are now ${senderName}`);
              }}
              className="w-12 h-12 flex-shrink-0"
            >
              <UserIcon className="p-2 rounded-full border border-gray-200 dark:border-gray-800" />
            </div>
          ) : (
            <div
              className="flex-shrink-0 cursor-pointer"
              onClick={() => {
                setAnonymous(true);
                toast("You are now anonymous");
              }}
            >
              <InitialsAvatar nickname={senderName || "U"} size={48} />
            </div>
          )}
        </div>
      )}
      {/* Input for message and emoji button */}
      <div className="flex min-h-12 items-center w-full rounded-[20px] border border-gray-200 dark:border-gray-800 pl-1">
        <Popover className="overflow-auto max-w-screen">
          <PopoverTrigger>
            <button className="p-2 text-gray-500 dark:text-white hover:text-primary hover:dark:text-primary">
              <FaceSmileIcon className="size-6" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="max-w-sm overflow-auto">
            <Picker
              data={data}
              onEmojiSelect={handleEmojiSelect}
              theme={theme}
            />
          </PopoverContent>
        </Popover>

        <textarea
          ref={textareaRef} // Reference to textarea
          rows={1}
          maxLength={1000}
          placeholder={`Type your message`}
         className="w-full min-h-6 py-1 resize-none bg-transparent outline-none focus:ring-0 text-gray-800 dark:text-gray-100 overflow-y-auto border-none"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onInput={adjustTextareaHeight} // Adjust height while typing
        />
      </div>

      <Button
        onPress={handleSendMessage}
        isIconOnly
        variant="ghost"
        color={"primary"}
        className={`h-12 w-12 flex-shrink-0 rounded-[20px] ${
          !message && "hidden"
        }`}
        disabled={!message.trim()}
      >
        <PaperAirplaneIcon className="size-6" />
      </Button>
    </div>
  );
};

export default MessageInput;