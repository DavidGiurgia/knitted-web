"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";
import { ImagePlus, Edit } from "lucide-react";

const UploadImagePost = ({ files, setFiles, onRemove }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fileURLs, setFileURLs] = useState([]);

  useEffect(() => {
    if (files.length === 0) {
      onRemove();
      setFileURLs([]);
      return;
    }

    const newURLs = files.map((file) => URL.createObjectURL(file));
    setFileURLs(newURLs);

    return () => newURLs.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files).filter(
      (file) =>
        file.type.startsWith("image/") ||
        (file.type.startsWith("video/") && file.size <= 10 * 1024 * 1024)
    );

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);

    if (updatedFiles.length === 0) {
      onRemove();
    } else {
      setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % files.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + files.length) % files.length
    );
  };

  return (
    <div className="w-full">
      {files.length > 0 ? (
        <div className="relative h-80 w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
          {/* Buton pentru ștergerea imaginii curente */}
          <div className="absolute top-2 right-2 z-10">
            <Button
            isIconOnly
              variant="solid"
              size="sm"
              radius="full"
              className="bg-opacity-10"
              onPress={() => handleRemoveFile(currentIndex)}
            >
              <XMarkIcon className="w-6 h-6 text-red-500" />
            </Button>
          </div>

          {/* Afișarea imaginii sau a videoclipului */}
          {files[currentIndex].type.startsWith("image/") ? (
            <img
              alt="Upload Preview"
              src={fileURLs[currentIndex]}
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={fileURLs[currentIndex]}
              controls
              className="w-full h-full object-cover"
            />
          )}

          {/* Navigare stânga / dreapta dacă sunt mai multe fișiere */}
          {files.length > 1 && (
            <>
              <button
                className="absolute left-2 bg-black bg-opacity-50 p-2 rounded-full z-10"
                onClick={prevSlide}
              >
                <ChevronLeftIcon className="w-6 h-6 text-white" />
              </button>
              <button
                className="absolute right-2 bg-black bg-opacity-50 p-2 rounded-full z-10"
                onClick={nextSlide}
              >
                <ChevronRightIcon className="w-6 h-6 text-white" />
              </button>
            </>
          )}
        </div>
      ) : null}

      {/* Buton pentru încărcarea fișierelor */}
      {files.length === 0 && (
        <label
          htmlFor="file-upload"
          className="cursor-pointer w-full h-80 flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-lg"
        >
          <ImagePlus className="w-10 h-10 text-gray-500 flex-shrink-0" />
        </label>
      )}

      {/* Input pentru fișiere */}
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileUpload}
        className="hidden"
        id="file-upload"
        multiple
      />

      {/* Buton "Editează selecția" vizibil după ce ai încărcat fișiere */}
      {files.length > 0 && (
        <div className="flex justify-center mt-3">
          <Button
            variant="flat"
            onPress={() => document.getElementById("file-upload").click()}
          >
            <ImagePlus className="w-5 h-5 mr-2" />
            Add
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadImagePost;
