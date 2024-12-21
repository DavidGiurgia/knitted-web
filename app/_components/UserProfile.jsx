"use client";

import React, { useEffect, useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@nextui-org/react";
import {
  ArrowLeftIcon,
  Bars3Icon,
  ChevronDownIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../_context/AuthContext";
import {
  acceptFriendRequest,
  blockUser,
  cancelFriendRequest,
  getFriendsAndRelations,
  removeFriend,
  request,
  unblockUser,
} from "../api/friends"; // Importă metoda getUserById
import toast from "react-hot-toast";
import { getUserById } from "../services/userService";
import { usePanel } from "../_context/PanelContext";
import ProfileModal from "./modals/ProfileModal";
import PictureModal from "./modals/PictureModal";
const UserProfile = ({ currentUser }) => {
  const { pushSubPanel, popSubPanel } = usePanel();
  const { user, fetchProfile } = useAuth();
  const [friends, setFriends] = useState([]); 
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenProfilePhoto,
    onOpen: onOpenProfilePhoto,
    onOpenChange: onOpenChangeProfilePhoto,
  } = useDisclosure();
  const [relationshipStatus, setRelationshipStatus] = useState("none");

  const getRelationshipStatus = () => {
    if (user?.blockedUsers.includes(currentUser._id)) return "blocked";
    if (user?.friendsIds.includes(currentUser._id)) return "friends";
    if (user?.sentRequests.includes(currentUser._id)) return "pending";
    if (user?.friendRequests.includes(currentUser._id)) return "incoming";
    return "none";
  };

  useEffect(() => {
    if (!currentUser?._id) {
      setFriends([]);
      return;
    }

    const fetchRelations = async () => {
      try {

        if (currentUser.friendsIds?.length > 0) {
          if(currentUser?.blockedUsers.includes(user?._id)){
            throw new Error("You don't have access to this user!");
          }
          const friendData = await Promise.all(
            currentUser.friendsIds.map((friendId) => getUserById(friendId))
          );
          setFriends(friendData.filter(Boolean));
        } else {
          setFriends([]);
        }

        const initialStatus = getRelationshipStatus();
        setRelationshipStatus(initialStatus);
      } catch (error) {
        console.error("Error fetching relations:", error);
        popSubPanel();
      }
    };

    fetchRelations();
  }, [currentUser, user]); // Asigură-te că useEffect se re-execută la schimbarea currentUser

  const handleFriendRequest = async (type) => {
    setLoading(true);
    try {
      let response;

      if (type === "add") {
        response = await request(user?._id, currentUser?._id);
      } else if (type === "cancel") {
        response = await cancelFriendRequest(user?._id, currentUser?._id);
      } else if (type === "accept") {
        response = await acceptFriendRequest(user?._id, currentUser?._id);
      } else if (type === "remove") {
        response = await removeFriend(user?._id, currentUser?._id);
      } else if (type === "block") {
        response = await blockUser(user?._id, currentUser?._id);
      } else if (type === "unblock") {
        response = await unblockUser(user?._id, currentUser?._id);
      }

      // Actualizează statusul relației imediat
      if (!response?.success) {
        toast.error(response?.message || "Failed to process the action.", {
          id: "response",
        });
      }

      await fetchProfile();
    } catch (error) {
      console.error("Error handling friend request:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-y-4">
      <div className="flex items-center gap-x-6 justify-between">
        <Button onPress={popSubPanel} variant="light" isIconOnly>
          <ArrowLeftIcon className="size-5" />
        </Button>
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly variant="light">
              <Bars3Icon className="size-6" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem className={`${!user.friendsIds.includes(currentUser._id) && "hidden"}`} onPress={() => handleFriendRequest("remove")}>
              Remove
            </DropdownItem>
            <DropdownItem onPress={() => handleFriendRequest("block")}>
              Block
            </DropdownItem>
            <DropdownItem>Report</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="flex flex-col gap-y-4">
        <div className="flex gap-x-4">
          <Badge
            color="primary"
            content="You"
            isInvisible={user?._id !== currentUser?._id}
            placement="bottom-right"
          >
            <Avatar
              onClick={() => {
                currentUser?.avatarUrl && onOpenProfilePhoto();
              }}
              showFallback
              src={currentUser?.avatarUrl}
              className="w-24 h-24 text-large flex-shrink-0"
            />
          </Badge>
          <div>
            <div className="text-xl font-medium text-dark-bg dark:text-light-bg ">
              {currentUser?.fullname || currentUser?.username || "Unknown"}
            </div>
            <div className="text-gray-500 max-w-64 text-md">
              {currentUser?.bio || currentUser?.email}
            </div>
          </div>
        </div>

        {friends.length > 0 ? (
          <div>
            <div className=" text-sm my-1">Friends</div>
            <AvatarGroup
              max={3}
              total={friends.length}
              renderCount={() => {
                const displayedCount = Math.min(3, friends.length); // Numărul de avatare afișate
                const hiddenCount = friends.length - displayedCount; // Diferența pentru cei ascunși
                return hiddenCount > 0 ? (
                  <p
                    onClick={() =>
                      pushSubPanel("FriendsSection", currentUser)
                    }
                    className="cursor-pointer hover:underline text-small text-foreground font-medium ms-2"
                  >
                    +{" " + hiddenCount} others
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
            <span className="font-medium ">{currentUser?.username + " "}</span>{" "}
            has no friends yet.
          </div>
        )}

        <div className="flex gap-x-2 w-full">
          {user?._id === currentUser?._id ? (
            <Button
              color="primary"
              variant="faded"
              className="flex-1 text-medium"
              onPress={onOpen}
            >
              Edit Profile
            </Button>
          ) : relationshipStatus === "none" ? (
            <Button
              onPress={() => handleFriendRequest("add")}
              className="flex-1 text-medium"
              color="primary"
              isLoading={loading}
            >
              Add Friend
            </Button>
          ) : relationshipStatus === "pending" ? (
            <Button
              onPress={() => handleFriendRequest("cancel")}
              className="flex-1 text-medium"
              color="primary"
              variant="faded"
              isLoading={loading}
            >
              Cancel request
            </Button>
          ) : relationshipStatus === "incoming" ? (
            <Button
              onPress={() => handleFriendRequest("accept")}
              className="flex-1 text-medium"
              color="primary"
              isLoading={loading}
            >
              Accept request
            </Button>
          ) : relationshipStatus === "friends" ? (
            <div className="w-full flex gap-x-1">
              <Button
                className="flex-1 text-medium"
                color="danger"
                variant="bordered"
                onPress={() => handleFriendRequest("remove")}
              >
                Remove
              </Button>
              <Button
                className="flex-1 text-medium"
                variant="faded"
                color="primary"
              >
                Message
              </Button>
            </div>
          ) : relationshipStatus === "blocked" ? (
            <Button
              className="flex-1 text-medium"
              color="error"
              variant="faded"
              onPress={() => handleFriendRequest("unblock")}
            >
              Unblock
            </Button>
          ) : null}
        </div>
      </div>
      <ProfileModal isOpen={isOpen} onOpenChange={onOpenChange} />
      <PictureModal
        isOpen={isOpenProfilePhoto}
        onOpenChange={onOpenChangeProfilePhoto}
        src={currentUser?.avatarUrl}
      />
    </div>
  );
};

export default UserProfile;
