import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";
import { Palette } from "lucide-react";
import React, { useEffect, useState } from "react";

const fonts = ["font-sans", "font-serif", "font-mono", "font-bold", "italic"];
const backgrounds = [
  "bg-yellow-200 dark:bg-yellow-800",
  "bg-blue-200 dark:bg-blue-800",
  "bg-green-200 dark:bg-green-800",
  "bg-pink-200 dark:bg-pink-800",
  "bg-orange-200 dark:bg-orange-800",
  "bg-purple-200 dark:bg-purple-800",
  "bg-red-200 dark:bg-red-800",
  "bg-gray-200 dark:bg-gray-800",
];

const TextEditor = ({ message, setMessage, onRemove }) => {
  const [fontIndex, setFontIndex] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);
  const [fontSize, setFontSize] = useState("text-3xl"); // Font-size dinamic

  const cycleFont = () => {
    setFontIndex((prev) => (prev + 1) % fonts.length);
  };

  const cycleBackground = () => {
    setBgIndex((prev) => (prev + 1) % backgrounds.length);
  };

  const handleTextareaInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;

    const newHeight = e.target.scrollHeight;

    // Reducem dimensiunea textului la înălțimi mai mari
    if (newHeight > 300) {
      setFontSize("text-xl");
    } else if (newHeight > 200) {
      setFontSize("text-2xl");
    } else {
      setFontSize("text-3xl");
    }
  };

  return (
    <div
      className={`relative w-full min-h-72 rounded-lg flex items-center justify-center pt-12
        ${backgrounds[bgIndex]} p-4 overflow-hidden`}
    >
      {/* Butoane */}
      <div className="absolute top-2 flex items-center w-full px-2 gap-x-2">
        <Button
          radius="full"
          variant="solid"
          className="bg-opacity-20"
          onPress={cycleFont}
          isIconOnly
        >
          <span className={`${fonts[fontIndex]} text-2xl`}>T</span>
        </Button>
        <Button
          radius="full"
          variant="solid"
          className="bg-opacity-20"
          onPress={cycleBackground}
          isIconOnly
        >
          <Palette />
        </Button>
        <Button
          radius="full"
          variant="solid"
          className="bg-opacity-20 ml-auto"
          isIconOnly
          onPress={onRemove}
        >
          <XMarkIcon className="size-6" />
        </Button>
      </div>

      {/* Textarea */}
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        maxLength={2000}
        onInput={handleTextareaInput}
        autoFocus
        placeholder="Share your thoughts..."
        className={`w-full text-center bg-transparent border-none outline-none resize-none 
            ${fonts[fontIndex]} ${fontSize} font-semibold text-opacity-80`}
        style={{ minHeight: "72px" }} // Asigurăm o înălțime minimă
      />
    </div>
  );
};

export default TextEditor;
