'use client';

import { useState, useRef, useEffect } from "react";
import { FaceSmileIcon } from "@heroicons/react/24/outline";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const MessageInput = () => {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const pickerRef = useRef(null);
  const buttonRef = useRef(null);
  const textareaRef = useRef(null);

  const [message, setMessage] = useState("");

  // Funcție pentru a verifica dacă click-ul a fost în afacerea picker-ului sau pe butonul de emoji
  const handleClickOutside = (e) => {
    if (
      pickerRef.current &&
      !pickerRef.current.contains(e.target) &&
      !buttonRef.current.contains(e.target)
    ) {
      setIsEmojiPickerOpen(false); // Închide picker-ul dacă click-ul nu a fost pe butonul de emoji sau pe picker
    }
  };

  // Folosim un effect pentru a adăuga și elimina evenimentul de click în afacerea documentului
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleEmojiPicker = () => {
    setIsEmojiPickerOpen((prev) => !prev);
  };

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
    <div className="relative w-full">
      {/* Emoji Picker div care se afișează deasupra inputului */}
      {isEmojiPickerOpen && (
        <div
          ref={pickerRef}
          className="absolute bottom-full left-0 mb-2 shadow-lg"
        >
          <div className="overflow-auto">
            <Picker 
              data={data}
              onEmojiSelect={handleEmojiSelect}
              theme={localStorage.getItem("theme")}
            />
          </div>
        </div>
      )}

      {/* Input pentru mesaj și butonul de emoji */}
      <div className="flex min-h-12 items-center w-full rounded-xl bg-gray-200 dark:bg-gray-800 pl-1">
        <button
          ref={buttonRef}
          onClick={toggleEmojiPicker}
          className="p-2 text-gray-500 dark:text-white hover:text-primary hover:dark:text-primary"
        >
          <FaceSmileIcon className="size-6" />
        </button>
        <textarea
          ref={textareaRef} // Referința către textarea
          rows={1}
          maxLength={1000}
          placeholder="Type your message"
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
