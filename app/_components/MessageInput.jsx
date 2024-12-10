"use client";

import { useState, useRef, useEffect } from "react";
import { FaceSmileIcon } from "@heroicons/react/24/outline";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Textarea } from "@nextui-org/react";

const MessageInput = ({ value }) => {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const pickerRef = useRef(null); // Ref pentru picker
  const buttonRef = useRef(null); // Ref pentru butonul de emoji

  const [message, setMessage] = useState("");

  const toggleEmojiPicker = () => {
    setIsEmojiPickerOpen((prev) => !prev);
  };

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

  const handleEmojiSelect = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.native);
  };

  return (
    <div className="relative w-full">
      {/* Emoji Picker div care se afișează deasupra inputului */}
      {isEmojiPickerOpen && (
        <div
          ref={pickerRef} // Setăm ref-ul pe picker
          className="absolute bottom-full left-0 mb-2  shadow-lg"
        >
          <div className="overflow-auto">
            <Picker
              data={data} // Adaugă datele emoji-urilor
              onEmojiSelect={handleEmojiSelect}
              theme={localStorage.getItem("theme")} // Setează tema pe baza modului dark
            />
          </div>
        </div>
      )}

      {/* Input pentru mesaj și butonul de emoji */}
      <div className="flex min-h-12 items-center w-full rounded-xl bg-gray-200 dark:bg-gray-800 pl-1">
        <button
          ref={buttonRef} // Setăm ref-ul pe butonul de emoji
          onClick={toggleEmojiPicker}
          className="p-2 text-gray-500 dark:text-white hover:text-primary hover:dark:text-primary"
        >
          <FaceSmileIcon className="size-6" />
        </button>
        {/* Folosim un textarea care va permite textului să se întindă pe mai multe linii */}
        <Textarea
          cols={1}
          placeholder="Type your message"
          //radius="md"
          className={`w-full bg-transparent ${
            value ? "text-visible" : "text-hidden"
          }`}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </div>
    </div>
  );
};

export default MessageInput;
