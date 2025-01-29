"use client";

import {
  Bars3Icon,
  BellIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import ProfileModal from "../../modals/ProfileModal";
import { getUserById } from "@/app/services/userService";
import PictureModal from "../../modals/PictureModal";
import { ThemeSwitcher } from "../../ThemeSwitcher";
import InitialsAvatar from "../../InitialsAvatar";

const Profile = ({ user, logout, switchPanel, pushSubPanel }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenProfilePhoto,
    onOpen: onOpenProfilePhoto,
    onOpenChange: onOpenChangeProfilePhoto,
  } = useDisclosure();

  const [friends, setFriends] = useState([]);

  useEffect(() => {
    // Obține avatarurile prietenilor din relații
    const fetchFriendAvatars = async () => {
      if (!user?.friendsIds || user.friendsIds.length === 0) return;

      try {
        const friendPromises = user.friendsIds.map(
          (friendId) => getUserById(friendId) // Fetch fiecare prieten după ID
        );
        const friendData = await Promise.all(friendPromises);

        // Filtrare pentru a exclude prietenii inexistenți
        const validFriends = friendData.filter(Boolean);

        setFriends(validFriends);
      } catch (error) {
        console.error("Error fetching friend avatars:", error);
      }
    };

    fetchFriendAvatars();
  }, [user]);

  return (
    <div className="p-4 flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div onClick={()=>{
          pushSubPanel("AccountSettings");
        }} className="ml-2 flex items-center gap-x-1 cursor-pointer hover:underline   text-gray-500"> 
        {user?.username}
        </div>
        <div>
        <Button
          variant="light"
          isIconOnly
          onPress={() => {
            switchPanel("Notifications");
          }}
          className=" rounded-lg "
        >
          <BellIcon className="size-6" />
        </Button>

        <Dropdown>
          <DropdownTrigger>
            <Button variant="light" isIconOnly className=" rounded-lg ">
              <Bars3Icon className="size-6" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem
              description="Settings, activity  and more"
              variant="faded"
              key="Settings"
              onPress={() => {
                pushSubPanel("Settings");
              }}
            >
              More
            </DropdownItem>
            <DropdownItem variant="bordered" key="dark mode">
              <div className="flex items-center justify-between">
                <span>Dark mode</span> <ThemeSwitcher size="sm" />
              </div>
            </DropdownItem>
            <DropdownItem
              //modal
              variant="faded"
              key="feedback"
            >
              Feedback
            </DropdownItem>
            <DropdownItem variant="faded" key="about">
              About
            </DropdownItem>
            <DropdownItem
              variant="faded"
              onPress={logout}
              key="logout"
              className="text-danger"
              color="danger"
            >
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        </div>
      </div>

      <div className="flex flex-col gap-y-4 mt-2">
        <div className="flex gap-4 flex-wrap mb-4">
          {/* Verifică dacă există avatarUrl și folosește-l */}
          {user?.avatarUrl ? (
            <div
              onClick={onOpenProfilePhoto}
              className="w-24 h-24 flex-shrink-0 rounded-full overflow-hidden flex items-center justify-center"
            >
              <Avatar
                showFallback
                className="w-24 h-24 object-cover "
                src={user?.avatarUrl}
              />
            </div>
          ) : (
            <InitialsAvatar nickname={user?.fullname} size={96}/>
          )}

          <div className="">
            <div className="text-xl font-medium text-dark-bg dark:text-light-bg ">
              {user?.fullname || user?.username || "Unknown"}
            </div>
            <div className="text-gray-500 line-clamp-3 text-md">
              {user?.bio || user?.email}
            </div>
          </div>
        </div>

        

        <div className="flex gap-x-2 w-full">
          <Button
            variant="bordered"
           
            className="flex-1 text-medium "
            onPress={onOpen}
          >
            Edit profile
          </Button>
        </div>
      </div>

      <div className="p-2 border border-gray-200 dark:border-gray-800 rounded-lg flex flex-col ">
        <h1 className="text-lg font-semibold">Friends</h1>
        <div
          onClick={() => pushSubPanel("FriendsSection", user)}
          className="flex w-fit items-center text-sm gap-1 cursor-pointer hover:underline"
        >
          <p className=" font-semibold text-gray-700  dark:text-gray-300 ">
            {friends?.length}
          </p>
          <p className="text-gray-600 dark:text-gray-400">friends </p>
        </div>
      </div>

      <ProfileModal isOpen={isOpen} onOpenChange={onOpenChange} />
      <PictureModal
        isOpen={isOpenProfilePhoto}
        onOpenChange={onOpenChangeProfilePhoto}
        src={user?.avatarUrl}
      />
    </div>
  );
};

export default Profile;
