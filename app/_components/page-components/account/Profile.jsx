'use client';

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

const Profile = ({ user, userRelations, logout, switchPanel, pushSubPanel }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    // Obține avatarurile prietenilor din relații
    const fetchFriendAvatars = async () => {
      if (!userRelations?.friends || userRelations.friends.length === 0) return;

      try {
        const friendPromises = userRelations.friends.map(
          (friendId) => getUserById(friendId) // Fetch fiecare prieten după ID
        );
        const friendData = await Promise.all(friendPromises);
        setFriends(
          friendData
        );
      } catch (error) {
        console.error("Error fetching friend avatars:", error);
        toast.error("Unable to load friend data.");
      }
    };

    fetchFriendAvatars();
  }, [userRelations]);

  return (
    <div className="p-4">
      <div className="justify-self-end">
        <Button
          isIconOnly
          onPress={() => {
            switchPanel("Notifications");
          }}
          className=" rounded-lg bg-transparent"
        >
          <BellIcon className="w-6 h-6" />
        </Button>

        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly className=" rounded-lg bg-transparent">
              <Bars3Icon className="w-6 h-6 " />
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

      <div className="flex flex-col gap-y-4">
        <div className="flex gap-x-4">
          {/* Verifică dacă există avatarUrl și folosește-l */}
          {user?.avatarUrl ? (
            <div className="w-24 h-24 flex-shrink-0 rounded-full overflow-hidden flex items-center justify-center">
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

        {user?.friendsIds.length > 0 ? (
                  <AvatarGroup
                    max={3}
                    total={friends.length}
                    renderCount={(count) => (
                      <p className="text-small text-foreground font-medium ms-2">
                        +{count} friends
                      </p>
                    )}
                  >
                    {friends.map((friend) => (
                      <Avatar onClick={()=>{}}  showFallback key={friend._id} src={friend.avatarUrl} />
                    ))}
                  </AvatarGroup>
                ) : (
                  <div className="text-gray-500 text-medium">No friends yet.</div>
                )}

        <div className="flex gap-x-2 w-full">
          <Button
            variant="faded"
            color="primary"
            size="sm"
            className="flex-1 text-medium "
            onPress={onOpen}
          >
            Edit profile
          </Button>
          <Button color="primary" isIconOnly variant="faded" size="sm">
            <EllipsisHorizontalIcon />
          </Button>
        </div>
      </div>

      <ProfileModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
};

export default Profile;
