"use client";

import React, { useEffect, useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@nextui-org/react";
import { ArrowLeftIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { useAuth } from "../_context/AuthContext";
import {
  acceptFriendRequest,
  blockUser,
  cancelFriendRequest,
  getMutualFriends,
  removeFriend,
  request,
  unblockUser,
} from "../api/friends"; // Importă metoda getUserById
import toast from "react-hot-toast";
import { getUserById } from "../services/userService";
import { usePanel } from "../_context/PanelContext";
import ProfileModal from "./modals/ProfileModal";
import PictureModal from "./modals/PictureModal";
import ProfileCard from "./ProfileCard";
const UserProfile = ({ currentUser }) => {
  const { pushSubPanel, popSubPanel } = usePanel();
  const { user, fetchProfile } = useAuth();
  const [friends, setFriends] = useState([]);
  const [mutualFriends, setMutualFriends] = useState([]);

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
        if (currentUser?.friendsIds?.length > 0) {
          // Fetch all friends of the current user
          const friendData = await Promise.all(
            currentUser.friendsIds.map((friendId) =>
              getUserById(friendId).catch((err) => {
                console.error(
                  `Error fetching friend with ID ${friendId}:`,
                  err
                );
                return null; // Handle errors gracefully
              })
            )
          );

          // Filter out any null responses
          const validFriends = friendData.filter(Boolean);
          setFriends(validFriends);

          // Determine mutual friends
          const mutualFriends = validFriends.filter((friend) =>
            user?.friendsIds.includes(friend._id)
          );
          setMutualFriends(mutualFriends || []);
        } else {
          setFriends([]);
          setMutualFriends([]);
        }

        // Set the initial relationship status
        const initialStatus = getRelationshipStatus();
        setRelationshipStatus(initialStatus);
      } catch (error) {
        console.error("Error fetching relations:", error);
        popSubPanel(); // Fallback action on error
      }
    };

    fetchRelations();
  }, [currentUser, user]); // Asigură-te că useEffect se re-execută la schimbarea currentUser

  const handleFriendRequest = async (type) => {
    if (!user) {
      alert("please login");
      return;

      ///create account alert
    }

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

  return !currentUser ? (
    <div className="p-4 flex flex-col w-full h-full">
      <div className="">
        <Button onPress={popSubPanel} variant="light" isIconOnly>
          <ArrowLeftIcon className="size-5" />
        </Button>
      </div>
      <div className=" flex  w-full h-full items-center justify-center">
        This user no longer exists
      </div>
    </div>
  ) : (
    <div className="p-4 flex flex-col gap-y-4 w-full ">
      <div className="flex items-center gap-x-6 justify-between">
        <Button onPress={popSubPanel} variant="light" isIconOnly>
          <ArrowLeftIcon className="size-5" />
        </Button>
        <Dropdown>
          <DropdownTrigger>
            <Button
              className={user?._id === currentUser?._id && "hidden"}
              isIconOnly
              variant="light"
            >
              <Bars3Icon className="size-6" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem
              className={`${
                !user?.friendsIds.includes(currentUser?._id) && "hidden"
              }`}
              onPress={() => handleFriendRequest("remove")}
            >
              Remove
            </DropdownItem>
            <DropdownItem onPress={() => handleFriendRequest("block")}>
              Block
            </DropdownItem>
            <DropdownItem>Report</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="flex gap-4 flex-wrap">
        <Badge
          color="primary"
          content="You"
          isInvisible={user?._id !== currentUser?._id}
          className="rounded-lg border-white dark:border-gray-800 "
          placement="bottom-right"
        >
          <Avatar
            onClick={() => {
              currentUser?.avatarUrl && onOpenProfilePhoto();
            }}
            showFallback
            src={currentUser?.avatarUrl}
            className="w-24 h-24 text-large "
          />
        </Badge>
        <div className="flex-1">
          <div className="text-xl  font-medium text-dark-bg dark:text-light-bg ">
            {currentUser?.fullname || currentUser?.username || "Unknown"}
          </div>
          <div className="text-gray-500 text-medium max-w-xl">
            {currentUser?.bio || currentUser?.email}
          </div>
        </div>
      </div>

      {currentUser?._id !== user?._id &&
        (mutualFriends.length > 0 ? (
          <div className="flex items-center gap-x-2">
              <AvatarGroup
                max={3}
                total={mutualFriends.length}
                renderCount={() => {
                  const displayedCount = Math.min(3, mutualFriends.length);
                  const hiddenCount = mutualFriends.length - displayedCount;
                  return hiddenCount > 0 ? (
                    <p
                      onClick={() =>
                        pushSubPanel("MutualFriendsSection", currentUser)
                      }
                      className="cursor-pointer hover:underline text-small text-foreground font-medium ms-2"
                    >
                      {mutualFriends[0].username +
                        " and " +
                        hiddenCount +
                        " others"}
                    </p>
                  ) : null;
                }}
              >
                {mutualFriends.slice(0, 3).map((friend) => (
                  <Popover placement="bottom" key={friend._id}>
                    <PopoverTrigger>
                      <Avatar showFallback src={friend.avatarUrl} />
                    </PopoverTrigger>
                    <PopoverContent>
                      <ProfileCard currentUser={friend} />
                    </PopoverContent>
                  </Popover>
                ))}
              </AvatarGroup>

              <p
                className="cursor-pointer hover:underline"
                onClick={() => pushSubPanel("MutualFriendsSection", currentUser)}
              >
                {mutualFriends.length === 1
                  ? mutualFriends[0].username
                  : mutualFriends.length === 2
                  ? mutualFriends[0].username + " and " + mutualFriends[1].username
                  : mutualFriends.length === 3
                  ? mutualFriends[0].username +
                    ", " +
                    mutualFriends[1].username +
                    " and " +
                    mutualFriends[2].username
                  : 
                    mutualFriends.length > 3 ? 
                    mutualFriends[0].username +
                    ", " +
                    mutualFriends[1].username +
                    ", " +
                    mutualFriends[2].username + 
                    " and " + (mutualFriends.length - 3) + " others"
                  : null}
              </p>
            </div>
        ) : (
          <div className="text-gray-500 text-medium">No mutual friends.</div>
        ))}

      {user?._id === currentUser?._id ? (
        <Button
          variant="bordered"
          className="w-full text-medium"
          onPress={onOpen}
        >
          Edit Profile
        </Button>
      ) : relationshipStatus === "none" ? (
        <Button
          onPress={() => handleFriendRequest("add")}
          className="w-full text-medium"
          color="primary"
          isLoading={loading}
        >
          Add Friend
        </Button>
      ) : relationshipStatus === "pending" ? (
        <Button
          onPress={() => handleFriendRequest("cancel")}
          className="w-full text-medium"
          color="primary"
          variant="bordered"
          isLoading={loading}
        >
          Cancel request
        </Button>
      ) : relationshipStatus === "incoming" ? (
        <Button
          onPress={() => handleFriendRequest("accept")}
          className="w-full text-medium"
          color="primary"
          variant="bordered"
          isLoading={loading}
        >
          Accept request
        </Button>
      ) : relationshipStatus === "friends" ? (
        <div className="w-full flex gap-x-1">
          <Dropdown>
            <DropdownTrigger>
              <Button
                className="w-full text-medium"
                variant="bordered"
                color="default"
                onPress={() => handleFriendRequest("remove")}
              >
                Friends
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                className={`${
                  !user?.friendsIds.includes(currentUser._id) && "hidden"
                }`}
                onPress={() => handleFriendRequest("remove")}
              >
                Remove
              </DropdownItem>
              <DropdownItem onPress={() => handleFriendRequest("block")}>
                Block
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Button variant="bordered" className="w-full text-medium">
            Message
          </Button>
        </div>
      ) : relationshipStatus === "blocked" ? (
        <Button
          className="w-full text-medium"
          //color="danger"
          variant="faded"
          onPress={() => handleFriendRequest("unblock")}
        >
          Unblock
        </Button>
      ) : null}

      <div className="p-2 border border-gray-200 dark:border-gray-800 rounded-lg flex flex-col ">
        <h1 className="text-lg font-semibold">Friends</h1>
        <div
          onClick={() => {
            (currentUser?._id === user?._id ||
            currentUser?.friendsIds?.includes(user?._id)) &&
              pushSubPanel("FriendsSection", currentUser);
          }}
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
        src={currentUser?.avatarUrl}
      />
    </div>
  );
};

export default UserProfile;
