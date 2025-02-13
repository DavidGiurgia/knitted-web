"use client";

import { Bars3Icon, CameraIcon, PlusIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Skeleton,
  useDisclosure,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import ProfileModal from "../../modals/ProfileModal";
import { getUserById } from "@/app/services/userService";
import PictureModal from "../../modals/PictureModal";
import { ThemeSwitcher } from "../../ThemeSwitcher";
import InitialsAvatar from "../../InitialsAvatar";
import CreatePostModal from "../../post-items/CreatePostModal";
import { usePanel } from "@/app/_context/PanelContext";
import Image from "next/image";

const Profile = ({ user, logout, pushSubPanel }) => {
  const { screenSize } = usePanel();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenProfilePhoto,
    onOpen: onOpenProfilePhoto,
    onOpenChange: onOpenChangeProfilePhoto,
  } = useDisclosure();
  const {
    isOpen: isOpenCreatePost,
    onOpen: onOpenCreatePost,
    onOpenChange: onOpenChangeCreatePost,
  } = useDisclosure();

  const [friends, setFriends] = useState([]);

  useEffect(() => {
    console.log(user?.avatarUrl);
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
    <div className=" flex flex-col border-red-500">
      <div className="flex items-center justify-between p-2">
        <Button variant="light" onPress={() => {}}>
          {user?.username}
        </Button>
        <div className="flex items-center gap-y-1 ">
          <Button
            variant="light"
            isIconOnly
            onPress={() => {
              if (screenSize > 640) {
                onOpenCreatePost();
              } else {
                pushSubPanel("CreatePost");
              }
            }}
          >
            <PlusIcon className="size-6" />
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

      <div className="flex flex-col gap-y-4 ">
        <div className="relative w-full h-40 bg-gray-100 dark:bg-gray-900 mb-4">
          {user?.coverUrl ? (
            <Image
              loading="lazy"
              src={user?.coverUrl}
              alt="Cover"
              layout="fill"
              objectFit="cover"
              quality={100}
            />
          ) : (
            <Skeleton disableAnimation className="w-full h-full" />
          )}

          <label
            onClick={() => {
              if (screenSize > 640) {
                onOpen();
              } else {
                pushSubPanel("EditProfile");
              }
            }}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-lg cursor-pointer"
          >
            <CameraIcon className="size-4" />
          </label>

          {/* Avatar */}
          <div className="absolute overflow-visibile flex items-center justify-center flex-shrink-0  left-24 bottom-[-20%] transform -translate-x-1/2 bg-white dark:bg-gray-950 rounded-full  w-[106px] h-[106px]">
            {user?.avatarUrl ? (
              <Avatar
                showFallback
                className="w-24 h-24 object-cover"
                src={user.avatarUrl}
                onClick={onOpenProfilePhoto}
              />
            ) : (
              <InitialsAvatar nickname={user?.fullname} size={96} />
            )}
          </div>
        </div>

        <div className="px-4 py-2 flex flex-col gap-y-2">
          <div className="w-full flex flex-col text-start">
            <div className="text-xl font-medium text-dark-bg dark:text-light-bg ">
              {user?.fullname || user?.username || "Unknown"}
            </div>
            <div className="text-gray-500 line-clamp-3 text-md">
              {user?.bio || user?.email}
            </div>
          </div>

          <div className="flex gap-x-2 w-full">
            <Button
              variant="bordered"
              className="flex-1 text-medium "
              onPress={() => {
                if (screenSize > 640) {
                  onOpen();
                } else {
                  pushSubPanel("EditProfile");
                }
              }}
            >
              Edit profile
            </Button>
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
        </div>
      </div>
      <ProfileModal isOpen={isOpen} onOpenChange={onOpenChange} />
      <PictureModal
        isOpen={isOpenProfilePhoto}
        onOpenChange={onOpenChangeProfilePhoto}
        src={user?.avatarUrl}
      />
      <CreatePostModal
        isOpen={isOpenCreatePost}
        onOpenChange={onOpenChangeCreatePost}
      />
    </div>
  );
};

export default Profile;
