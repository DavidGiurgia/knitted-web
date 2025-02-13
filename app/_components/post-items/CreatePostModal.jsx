"use client";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  useDisclosure,
} from "@heroui/react";
import React, { useState } from "react";
import InitialsAvatar from "../InitialsAvatar";
import { useAuth } from "@/app/_context/AuthContext";
import { usePanel } from "@/app/_context/PanelContext";
import {
  ChevronDownIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/16/solid";
import TextEditor from "./TextEditor";
import UploadImagePost from "./UploadImagePost";
import CreatePollTab from "./CreatePollTab";
import { BookImage, LetterText, Palette, Vote } from "lucide-react";

const CreatePostModal = ({ isOpen, onOpenChange, initialTab = "default" }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { screenSize } = usePanel();
  const [anonymously, setAnonymously] = useState(false);
  const { popSubPanel } = usePanel();
  const [selectedTab, setSelectedTab] = useState(
    initialTab === "anonymous" ? "default" : initialTab
  );
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);

  return (
    <Modal
      //size={screenSize < 640 && "full"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior="normal"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="p-1">
              <div className="flex items-center gap-x-2 py-2 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 rounded-xl">
                <div className="cursor-pointer">
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
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-normal">
                    Post to all your friends
                  </span>
                </div>
              </div>
            </ModalHeader>
            <ModalBody className="overflow-hidden p-2 flex flex-col items-center">
              <div className="w-full flex items-center justify-between  bg-gray-100 dark:bg-gray-900 p-4 rounded-xl">
                Post anonymously
                <Switch
                  onChange={() => setAnonymously(!anonymously)}
                  isSelected={anonymously}
                  color="primary"
                />
              </div>
              <div
                className={`h-full w-full flex-1 px-2 ${
                  selectedTab !== "default" ? "hidden" : ""
                }`}
              >
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  maxLength={2000}
                  autoFocus
                  placeholder="Share your thoughts..."
                  className={` p-2 h-72 resize-none bg-transparent border-none outline-none w-full `}
                />
              </div>
              <div
                className={`h-full w-full overflow-y-auto flex-1 p-2 ${
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
                className={`min-h-72 w-full overflow-y-auto p-2 ${
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
                className={`min-h-72 w-full overflow-y-auto p-2 ${
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

              <div className="flex items-center justify-center p-2 gap-x-2 w-fit rounded-lg border border-gray-200 dark:border-gray-800 overflow-x-auto overflow-y-hidden flex-shrink-0">
                <Button
                  size="sm"
                  color="secondary"
                  className=" justify-start flex-shrink-0 bg-opacity-90"
                  variant={selectedTab === "default" ? "solid" : "light"}
                  onPress={() => {
                    setSelectedTab("default");
                  }}
                >
                  <LetterText size={20} strokeWidth={1} absoluteStrokeWidth />
                  Text
                </Button>
                <Button
                  size="sm"
                  color="secondary"
                  className=" justify-start flex-shrink-0 bg-opacity-90"
                  variant={selectedTab === "text" ? "solid" : "light"}
                  onPress={() => {
                    setSelectedTab("text");
                  }}
                >
                  <Palette size={20} strokeWidth={1} absoluteStrokeWidth />
                  Background
                </Button>
                <Button
                  size="sm"
                  color="secondary"
                  className=" justify-start flex-shrink-0 bg-opacity-90"
                  variant={selectedTab === "upload" ? "solid" : "light"}
                  onPress={() => {
                    setSelectedTab("upload");
                  }}
                >
                  <BookImage size={20} strokeWidth={1} absoluteStrokeWidth />
                  Photo/Video
                </Button>
                <Button
                  size="sm"
                  color="secondary"
                  className=" justify-start flex-shrink-0 bg-opacity-90"
                  variant={selectedTab === "poll" ? "solid" : "light"}
                  onPress={() => {
                    setSelectedTab("poll");
                  }}
                >
                  <Vote size={20} strokeWidth={1} absoluteStrokeWidth />
                  Poll
                </Button>
              </div>
            </ModalBody>
            <ModalFooter className="p-4 border-t border-gray-300 dark:border-gray-700 flex items-center">
              <Button  isDisabled={true} color="primary" isLoading={loading}>
                Post
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreatePostModal;
