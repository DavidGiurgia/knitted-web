"use client";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  Switch,
  useDisclosure,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import InitialsAvatar from "../InitialsAvatar";
import { useAuth } from "@/app/_context/AuthContext";
import { usePanel } from "@/app/_context/PanelContext";
import { UserIcon } from "@heroicons/react/16/solid";
import UploadImagePost from "./UploadImagePost";
import TextEditor from "./TextEditor";
import CreatePollTab from "./CreatePollTab";
import { BookImage, Palette, PlusIcon, Vote } from "lucide-react";

const CreatePostSection = ({ initialTab = "default" }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [anonymously, setAnonymously] = useState(initialTab === "anonymous");
  const { popSubPanel, pushSubPanel } = usePanel();
  const [selectedTab, setSelectedTab] = useState(
    initialTab === "anonymous" ? "default" : initialTab
  );
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    console.log("initial tab:", initialTab);
    setAnonymously(initialTab === "anonymous");
    setSelectedTab(initialTab === "anonymous" ? "default" : initialTab);
  }, [initialTab]);

  return (
    <div className="w-full h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center p-2 gap-x-2 flex-shrink-0  border-gray-300 dark:border-gray-700">
        <Button onPress={popSubPanel} variant="light" isIconOnly>
          <ArrowLeftIcon className="size-5" />
        </Button>
        <div className="font-semibold text-lg">Create Post</div>

        <Button
          size="sm"
          isLoading={loading}
          color="primary"
          className="ml-auto"
        >
          Post
        </Button>
      </div>
      <div  className="w-full flex items-center justify-between  bg-gray-100 dark:bg-gray-900 p-4 ">
        Post anonymously
        <Switch onChange={()=>setAnonymously(!anonymously)} isSelected={anonymously}  color="primary"/>
      </div>

      <div onClick={()=>pushSubPanel("PostSettings", {anonymously, setAnonymously})} className="flex items-center gap-x-2 p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900">
        <div >
          {anonymously ? (
            <div className="w-[56px] h-[56px] flex-shrink-0">
              <UserIcon className=" p-2 rounded-full border border-gray-200 dark:border-gray-800" />
            </div>
          ) : (
            <div>
              {user?.avatarUrl ? (
                <Avatar size="lg" src={user.avatarUrl} />
              ) : (
                <InitialsAvatar nickname={user?.fullname} size={56} />
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col  ">
          <div className="text-gray-800 dark:text-gray-200 text-lg font-semibold">
            {anonymously ? "Anonymous" : user?.fullname}
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Post to all your friends
          </span>
        </div>
      </div>

        <div className="overflow-x-hidden overflow-y-auto p-2 flex-1 w-full">
          <div
            className={`h-full ${
              selectedTab !== "default" ? "hidden" : ""
            }`}
          >
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={2000}
              autoFocus
              placeholder="Share your thoughts..."
              className={` p-2 h-full resize-none bg-transparent border-none outline-none w-full `}
            />
          </div>

          <div
            className={`h-full w-full  ${
              selectedTab !== "text" ? "hidden" : ""
            }`}
          >
            <TextEditor
              message={message}
              setMessage={setMessage}
              onRemove={() => setSelectedTab("default")}
            />
          </div>
          <div
            className={`min-h-72 overflow-y-auto p-2 ${
              selectedTab !== "upload" ? "hidden" : ""
            }`}
          >
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={2000}
              autoFocus
              placeholder="Add a caption..."
              className={` p-2 min-h-20  resize-none bg-transparent border-none outline-none w-full `}
            />
            <UploadImagePost
              files={files}
              setFiles={setFiles}
              onRemove={() => setSelectedTab("default")}
            />
          </div>
          <div
            className={`min-h-72 overflow-y-auto p-2 ${
              selectedTab !== "poll" ? "hidden" : ""
            }`}
          >
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={2000}
              autoFocus
              placeholder="Add a description..."
              className={` p-2 min-h-20 resize-none bg-transparent border-none outline-none w-full `}
            />
            <CreatePollTab
              question={message}
              setQuestion={setMessage}
              onRemove={() => setSelectedTab("default")}
            />
          </div>
        </div>

      <div
        className={`flex items-center  justify-end shadow-lg w-full p-2 ${
          selectedTab !== "default" && "hidden"
        }`}
      >
        <Button onPress={onOpen} isIconOnly variant="light">
          <PlusIcon className="size-8 " />
        </Button>
      </div>

      <Modal
        backdrop="transparent"
        shadow="none"
        hideCloseButton
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="dark:bg-gray-950"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div className="flex flex-col gap-y-2 w-full ">
                  <Button
                    className="justify-start"
                    variant="light"
                    onPress={() => {
                      setSelectedTab("text");
                      onClose();
                    }}
                  >
                    <Palette size={28} strokeWidth={1} absoluteStrokeWidth />
                    Background
                  </Button>
                  <Button
                    className="justify-start"
                    variant="light"
                    onPress={() => {
                      setSelectedTab("upload");
                      onClose();
                    }}
                  >
                    <BookImage size={28} strokeWidth={1} absoluteStrokeWidth />
                    Photo/Video
                  </Button>
                  <Button
                    className="justify-start"
                    variant="light"
                    onPress={() => {
                      setSelectedTab("poll");
                      onClose();
                    }}
                  >
                    <Vote size={28} strokeWidth={1} absoluteStrokeWidth />
                    Poll
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CreatePostSection;
