import {
  ChatBubbleLeftEllipsisIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { Button, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/_context/AuthContext";
import NewChatModal from "../../modals/NewChatModal";
import { createRoom, fetchRoomsForUser } from "@/app/api/rooms";
import ChatLinkItem from "./ChatLinkItem";
import { searchUser } from "@/app/api/user";
import UserListItem from "../../UserListItem";

const ChatsList = ({ pushSubPanel }) => {
  const { user } = useAuth();
  const [value, setValue] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [chats, setChats] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = async (groupName, participantsArray) => {
    try {
      const participants = Array.from(new Set([...participantsArray, user._id]));
      // Creăm camera folosind numele calculat
      const room = await createRoom(groupName, participants);
      setChats((prevChats) => [room, ...prevChats]);
      pushSubPanel("ChatRoom", room);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        // Fetch chats
        const userChats = await fetchRoomsForUser(user._id);

        setChats(userChats);
      } catch (error) {
        console.error("Error fetching user chats:", error);
      }
    };

    if (user?._id) {
      fetchChats();
    }
  }, [user?._id]);

  useEffect(() => {
    const fetchResults = async () => {
      if (value.trim() === "") {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const result = await searchUser(value, user._id);
        setResults(result);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchResults();
    }, 300); // Debounce pentru a evita apeluri frecvente

    return () => clearTimeout(delayDebounceFn);
  }, [value]);

  return (
    <div className="h-full p-6 flex flex-col gap-y-4 overflow-y-auto">
      <div className="flex items-center justify-between gap-x-6">
        <div className="text-xl">Chats</div>

        <Button
          onPress={onOpen}
          isIconOnly
          className="p-0"
          startContent={<PencilSquareIcon className="w-6 h-6 " />}
          variant="light"
        />
      </div>

      <div className="flex items-center p-2 border border-gray-200 dark:border-gray-800 rounded-lg">
        <MagnifyingGlassIcon className="text-gray-500 size-4 mr-2" />
        <input
          autoFocus
          onChange={(event) => setValue(event.currentTarget.value)}
          value={value}
          placeholder="Search"
          className="flex-1 outline-none bg-transparent"
        />
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : value ? (
        results?.length > 0 ? (
          <ul className="flex flex-col gap-y-2">
            {results.map((currUser) => (
              <li
                className="flex items-center py-1 px-2 justify-between rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                key={currUser._id}
                onClick={async () => {
                  const participants = [currUser._id];
                  const groupName = currUser.fullname; // Utilizator unic
                  await handleCreateRoom(groupName, participants);
                }}
              >
                <UserListItem user={currUser} />
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
                className="flex w-full items-center text-sm gap-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg"
              >
                <div className="flex flex-wrap gap-1">
                  <ChatLinkItem
                    room={chat}
                    participants={chat.participantDetails}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onCreate={handleCreateRoom}
      />
    </div>
  );
};

export default ChatsList;
