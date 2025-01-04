import {
  ChatBubbleLeftEllipsisIcon,
  PencilSquareIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import React from "react";
import FriendsList from "../../FriendsList";
import { useAuth } from "@/app/_context/AuthContext";

const ChatsList = ({ pushSubPanel }) => {
  const { user } = useAuth();
  return (
    <div className="h-full p-6 flex flex-col">
      <div className="flex items-center justify-between gap-x-6">
        <div className="text-xl">Chats</div>

        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button
              isIconOnly
              className="p-0"
              startContent={<PencilSquareIcon className="w-6 h-6 " />}
              variant="light"
            />
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem variant="default">
              <FriendsList currUser={user} onSelect={(friend) => {pushSubPanel("ChatRoom", friend)}} />
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <div className="flex flex-col gap-y-8 justify-center items-center h-full w-full">
        <ChatBubbleLeftEllipsisIcon className="size-32 text-primary " />
        <div className="text-center max-w-sm">
          <h1 className="font-semibold text-lg">No messages</h1>
          <p className="text-gray-500"> New messages will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default ChatsList;
