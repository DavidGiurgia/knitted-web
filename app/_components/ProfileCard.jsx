"use client";

import { Avatar, Badge, Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useAuth } from "../_context/AuthContext";
import { usePanel } from "../_context/PanelContext";
import { getUserById } from "../services/userService";
import { acceptFriendRequest, blockUser, cancelFriendRequest, removeFriend, request, unblockUser } from "../api/friends";

const ProfileCard = ({ currentUser }) => {
  const { user, fetchProfile } = useAuth();
  const { pushSubPanel } = usePanel();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="p-3 w-full ">
      <div
        onClick={() => pushSubPanel("Profile", currentUser)}
        className="flex flex-wrap gap-x-4 gap-y-2 cursor-pointer"
      >
        <Badge
          size="sm"
          color="primary"
          content="You"
          isInvisible={user?._id !== currentUser?._id}
          className="rounded-lg border-white dark:border-gray-800 "
          placement="bottom-right"
        >
          <Avatar
            showFallback
            src={currentUser?.avatarUrl}
            className="w-16 h-16 text-lg"
          />
        </Badge>
        <div className="flex-1">
          <div className="text-lg font-medium text-gray-900 dark:text-white">
            {currentUser?.fullname || currentUser?.username || "Unknown"}
          </div>
          <div className="text-gray-500 text-sm ">{currentUser?.email}</div>
        </div>
      </div>

      <div className="flex flex-col mt-4 gap-y-4">
        <div className="flex gap-x-3">
          <div className="flex items-center gap-1">
            <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
              4
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Friends</p>
          </div>
          <div className="flex items-center gap-1">
            <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
              97.1K
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Posts</p>
          </div>
        </div>

        {user?._id === currentUser?._id ? null : relationshipStatus ===
          "none" ? (
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
          <Button
            className="w-full text-medium"
            variant="bordered"
            color=""
            onPress={() => handleFriendRequest("remove")}
          >
            Friends
          </Button>
        ) : relationshipStatus === "blocked" ? (
          <Button
            className="w-full text-medium"
            //color=""
            variant="flat"
            onPress={() => handleFriendRequest("unblock")}
          >
            Unblock
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default ProfileCard;
