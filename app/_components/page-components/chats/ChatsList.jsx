'use client';

import React, { useEffect, useState } from "react";
import { ChatBubbleLeftEllipsisIcon, MagnifyingGlassIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Button, useDisclosure } from "@heroui/react";
import { useAuth } from "@/app/_context/AuthContext";
import NewChatModal from "../../modals/NewChatModal";
import { fetchRoomsForUser } from "@/app/api/rooms";
import ChatMembersItem from "./ChatMembersItem";

const ChatsList = ({ pushSubPanel, screenSize }) => {
  const { user } = useAuth();
  const [value, setValue] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const userChats = await fetchRoomsForUser(user?._id);
        setChats(userChats);
      } catch (error) {
        console.error("Error fetching user chats:", error);
      }
      finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchChats();
    }
  }, [user?._id]);
  
  // Filter chats based on the search input
  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="h-full p-3 md:p-6 flex flex-col gap-y-4 overflow-y-auto overflow-x-hidden">
      <div className="flex items-center justify-between gap-x-6">
        <div className="text-xl">Chats</div>

        <Button
          onPress={() => {
            if (screenSize > 640) {
              onOpen();
            } else {
              pushSubPanel("NewChatSection");
            }
          }}
          isIconOnly
          className="p-0"
          startContent={<PencilSquareIcon className="w-6 h-6 " />}
          variant="light"
        />
      </div>

      {chats.length > 1 && (
        <div className="flex items-center p-2 border border-gray-200 dark:border-gray-800 rounded-lg">
          <MagnifyingGlassIcon className="text-gray-500 size-4 mr-2 flex-shrink-0" />
          <input
            onChange={(event) => setValue(event.currentTarget.value)}
            value={value}
            placeholder="Search"
            className="flex-1 outline-none bg-transparent"
          />
        </div>
      )}

      {loading ? (
        <div className="h-full w-full flex items-center justify-center">Loading your chats...</div>
      ) : value ? (
        filteredChats.length > 0 ? (
          <ul className="flex flex-col gap-y-2">
            {filteredChats.map((chat) => (
              <li
                className="flex items-center py-1 px-2 justify-between rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                key={chat._id}
                onClick={() => pushSubPanel("ChatRoom", chat)}
              >
                <div className="flex flex-wrap gap-1">
                  <ChatMembersItem
                    room={chat}
                    participants={chat.participantDetails}
                    variant="list"
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500">No results found</div>
        )
      ) : (
        <div
          className={`flex flex-col space-y-2 items-center h-full w-full ${
            chats.length === 0 ? "justify-center" : ""
          }`}
        >
          {chats.length === 0 ? (
            <div className="flex flex-col justify-center items-center ">
              <ChatBubbleLeftEllipsisIcon className="size-32 text-primary " />
              <div className="text-center max-w-sm">
                <h1 className="font-semibold text-lg">No messages</h1>
                <p className="text-gray-500"> New messages will appear here.</p>
              </div>
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => pushSubPanel("ChatRoom", chat)}
                className="flex w-full items-center text-sm gap-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 p-2 rounded-lg"
              >
                <div className="flex flex-wrap gap-1">
                  <ChatMembersItem room={chat} />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* New Chat Modal */}
      <NewChatModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
};

export default ChatsList;