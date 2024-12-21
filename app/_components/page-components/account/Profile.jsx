"use client";

import {
  Bars3Icon,
  BellIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import {
  Avatar,
  AvatarGroup,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import ProfileModal from "../../modals/ProfileModal";
import { getUserById } from "@/app/services/userService";
import PictureModal from "../../modals/PictureModal";
import { ThemeSwitcher } from "../../ThemeSwitcher";

const Profile = ({
  user,
  logout,
  switchPanel,
  pushSubPanel,
}) => {
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
        const friendPromises = user.friendsIds.map((friendId) =>
          getUserById(friendId) // Fetch fiecare prieten după ID
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
    <div className="p-4">
      <div className="justify-self-end">
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
                <span>Dark mode</span> <ThemeSwitcher size="sm"/>
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
      

      <div className="flex flex-col gap-y-4 mt-2">
        <div className="flex gap-x-4">
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
            <Avatar className="w-24 h-24 text-large flex-shrink-0" />
          )}

          <div>
            <div className="text-xl font-medium text-dark-bg dark:text-light-bg ">
              {user?.fullname || user?.username || "Unknown"}
            </div>
            <div className="text-gray-500 max-w-64 text-md">
              {user?.bio || user?.email}
            </div>
          </div>
        </div>

        {friends.length > 0 ? (
          <div>
            <div className=" text-sm my-1">Your friends</div>
            <AvatarGroup
              max={3}
              total={friends.length}
              renderCount={() => {
                const displayedCount = Math.min(3, friends.length); // Numărul de avatare afișate
                const hiddenCount = friends.length - displayedCount; // Diferența pentru cei ascunși
                return hiddenCount > 0 ? (
                  <p
                    onClick={() => pushSubPanel("FriendsSection")}
                    className="cursor-pointer hover:underline text-small text-foreground font-medium ms-2"
                  >
                    +{hiddenCount} others
                  </p>
                ) : null;
              }}
            >
              {friends.slice(0, 3).map((friend) => (
                <Avatar
                  onClick={() => {
                    pushSubPanel("Profile", friend);
                  }}
                  showFallback
                  key={friend._id}
                  src={friend.avatarUrl}
                />
              ))}
            </AvatarGroup>
          </div>
        ) : (
          <div className="text-gray-500 text-medium">
            You don't have friends yet.
          </div>
        )}

        <div className="flex gap-x-2 w-full">
          <Button
            variant="faded"
            color="primary"
            //size="sm"
            className="flex-1 text-medium "
            onPress={onOpen}
          >
            Edit profile
          </Button>
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
