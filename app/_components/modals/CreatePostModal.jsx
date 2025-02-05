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
  Textarea,
} from "@heroui/react";
import React, { useState } from "react";
import InitialsAvatar from "../InitialsAvatar";
import { useAuth } from "@/app/_context/AuthContext";
import { usePanel } from "@/app/_context/PanelContext";
import { ClockIcon, UserIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, UsersIcon } from "@heroicons/react/16/solid";

const CreatePostModal = ({ isOpen, onOpenChange }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { screenSize } = usePanel();
  const [anonymously, setAnonymously] = useState(false);

  return (
    <Modal
      size={screenSize < 640 && "full"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="rounded-lg absolute md:relative overflow-hidden"
      scrollBehavior='inside'
    >
      <ModalContent className="fixed bottom-0 left-0 right-0 md:relative">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className=" flex items-center gap-x-2  ">
                <div className="cursor-pointer">
                  {anonymously ? (
                    <div
                      onClick={() => {
                        setAnonymously(false);
                      }}
                      className="w-[56px] h-[56px] flex-shrink-0"
                    >
                      <UserIcon className=" p-2 rounded-full border border-gray-200 dark:border-gray-800" />
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        setAnonymously(true);
                      }}
                    >
                      {user?.avatarUrl ? (
                        <Avatar size="lg" src={user.avatarUrl} />
                      ) : (
                        <InitialsAvatar nickname={user?.fullname} size={56} />
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-col ">
                  <div className="text-gray-800 dark:text-gray-200 text-lg">
                    {anonymously ? "Anonymous" : user?.fullname}
                  </div>
                  <div className="flex items-center gap-x-2">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          size="sm"
                          variant="flat"
                          className="text-xs text-gray-500 font-thin flex items-center gap-x-2"
                        >
                          <UsersIcon className="size-4 " />
                          Friends
                          <ChevronDownIcon className="size-4 " />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem>Friends</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    {/* <Button
                      onPress={() => setAnonymously(!anonymously)}
                      size="sm"
                      variant="flat"
                      className="text-xs text-gray-500 font-thin flex items-center gap-x-2"
                    >
                      {anonymously ? "Anonymous" : user?.fullname}
                      <ArrowPathIcon className="size-4 " />
                    </Button> */}
                  </div>
                </div>
              </div>
            </ModalHeader>
            <ModalBody  className="overflow-y-auto" >
              <textarea
                className="w-full py-1 resize-none bg-transparent border-none outline-none focus:ring-0 text-gray-800 dark:text-gray-100 overflow-y-auto"
                rows={8}
                maxLength={1000}
                placeholder={`What do you want to talk about?`}
              />
            </ModalBody>
            <ModalFooter className="border-t border-gray-300 dark:border-gray-700 flex items-center">
              {/* <Button variant="light" isIconOnly>
                <ClockIcon className="size-6 text-gray-800 dark:text-gray-200" />
              </Button> */}
              <Button isDisabled={true} color="primary" isLoading={loading}>
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
