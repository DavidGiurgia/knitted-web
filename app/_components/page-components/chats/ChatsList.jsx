import {
  ChatBubbleLeftEllipsisIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { Button, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/_context/AuthContext";
import NewChatModal from "../../modals/NewChatModal";
import { fetchRoomsForUser } from "@/app/api/rooms";
import UserListItem from "../../UserListItem";
import { getUserById } from "@/app/services/userService";
import UsersGroupItem from "../../UsersGroupItem";
import ChatLinkItem from "./ChatLinkItem";

const ChatsList = ({ pushSubPanel }) => {
  const { user } = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [chats, setChats] = useState([]);

  const handleCreateRoom = (room) => {
    setChats((prevChats) => [room, ...prevChats]);
    pushSubPanel("ChatRoom", room);
  };

  const fetchParticipantDetails = async (participants) => {
    const participantDetails = await Promise.all(
      participants.map(async (participantId) => {
        try {
          //ignore current user
          if (participantId === user._id) return null;
           
          return await getUserById(participantId); // Extragerea detaliilor utilizatorului
        } catch (error) {
          console.error("Error fetching participant:", error);
          return null;
        }
      })
    );
    return participantDetails.filter(Boolean); // Elimină utilizatorii null (dacă există erori)
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        // Fetch chats
        const userChats = await fetchRoomsForUser(user._id);

         // Map room data to include participant details
         const chatsWithDetails = await Promise.all(
          userChats.map(async (chat) => {
            const participantDetails = await fetchParticipantDetails(chat.participants);
            return {
              ...chat,
              participantDetails, // Adăugăm detaliile participanților
            };
          })
        );

        setChats(chatsWithDetails);
      } catch (error) {
        console.error("Error fetching user chats:", error);
      }
    };

    if (user?._id) {
      fetchChats();
    }
  }, [user?._id]);

  return (
    <div className="h-full p-6 flex flex-col gap-y-4">
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

      <div className="flex flex-col space-y-2 items-center h-full w-full">
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
              className="flex w-full items-center text-sm gap-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 py-4 px-2 rounded-lg"
            >
              <div className="flex flex-wrap gap-1">
                <ChatLinkItem participants={chat.participantDetails} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onCreate={(room) => handleCreateRoom(room)}
      />
    </div>
  );
};

export default ChatsList;
