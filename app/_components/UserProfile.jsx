'use client'

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
} from "@nextui-org/react";
import {
  ArrowLeftIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../_context/AuthContext";
import { acceptFriendRequest, cancelFriendRequest, getFriendsAndRelations, request } from "../api/friends"; // Importă metoda getUserById
import toast from "react-hot-toast";
import { getUserById } from "../services/userService";

const UserProfile = ({ currentUser, goBack}) => {
  const { user, userRelations } = useAuth();
  const [relationshipStatus, setRelationshipStatus] = useState("none");
  const [friends, setFriends] = useState([]); // Stochează avatarurile prietenilor
  const [currentUserRelations, setCurrentUserRelations] = useState([]);

  useEffect(() => {
    console.log(userRelations);
    // Setează statusul relației
    if (userRelations?.blockedUsers.includes(currentUser?._id)) {
      setRelationshipStatus("blocked");
    } else if (userRelations?.friends.includes(currentUser?._id)) {
      setRelationshipStatus("friends");
    } else if (userRelations?.sentRequests.includes(currentUser?._id)) {
      setRelationshipStatus("pending");
    } else if (userRelations?.receivedRequests.includes(currentUser?._id)) {
      setRelationshipStatus("incoming");
    } else {
      setRelationshipStatus("none");
    }
  }, [userRelations, currentUser]);

  useEffect(() => {
    if (!currentUser || !currentUser._id) return; // Asigură-te că currentUser este definit
  
    const fetchFriendAvatars = async () => {
      try {
        const relations = await getFriendsAndRelations(currentUser._id);
        setCurrentUserRelations(relations);
  
        if (!relations.friends || relations.friends.length === 0) return;
  
        const friendPromises = relations.friends.map(
          (friendId) => getUserById(friendId)
        );
        const friendData = await Promise.all(friendPromises);
        setFriends(friendData);
      } catch (error) {
        console.error("Error fetching friend avatars:", error);
        toast.error("Unable to load friend data.");
      }
    };
  
    fetchFriendAvatars();
  }, [currentUser]);
  

  const handleAddFriend = async (receiverId) => {
    try {
      const response = await request(user?._id, receiverId);
      if (response?.message) {
        setRelationshipStatus("pending");
        toast.success(response.message);
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error sending friend request");
    }
  };

  const handleCancelRequest = async (receiverId) => {
    try {
      const response = await cancelFriendRequest(user?._id, receiverId);
      if (response?.message) {
        setRelationshipStatus("none");
        toast.success(response.message);
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error cancelling friend request");
    }
  };

  const handleAcceptRequest = async (receiverId) => {
    try {
      const response = await acceptFriendRequest(user?._id, receiverId);
      if (response?.message) {
        setRelationshipStatus("friends");
        toast.success(response.message);
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error accepting friend request");
    }
  };

  return (
    <div className="p-4 flex flex-col gap-y-4">
      <div className="flex items-center gap-x-6">
        <Button onPress={goBack} variant="light" isIconOnly>
          <ArrowLeftIcon className="size-5" />
        </Button>
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

        {currentUser?.friendsIds.length > 0 ? (
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
          {user?._id === currentUser?._id ? (
            <Button
              color="primary"
              variant="faded"
              size="sm"
              className="flex-1 text-medium"
            >
              Edit Profile
            </Button>
          ) : relationshipStatus === "none" ? (
            <Button
              onPress={() => handleAddFriend(currentUser?._id)}
              className="flex-1 text-medium"
              size="sm"
              color="primary"
            >
              Add Friend
            </Button>
          ) : relationshipStatus === "pending" ? (
            <Button
              onPress={() => handleCancelRequest(currentUser?._id)}
              className="flex-1 text-medium"
              size="sm"
              color="primary"
              variant="faded"
            >
              Request Sent
            </Button>
          ) : relationshipStatus === "incoming" ? (
            <Button
              onPress={() => handleAcceptRequest(currentUser?._id)}
              className="flex-1 text-medium"
              size="sm"
              color="primary"
            >
              Accept Request
            </Button>
          ) : relationshipStatus === "friends" ? (
            <Button
              className="flex-1 text-medium"
              size="sm"
              color="primary"
              variant="faded"
            >
              Message
            </Button>
          ) : relationshipStatus === "blocked" ? (
            <Button
              className="flex-1 text-medium"
              size="sm"
              color="error"
              variant="faded"
            >
              Blocked
            </Button>
          ) : null}
          <Dropdown>
            <DropdownTrigger>
              <Button
                className={`${user?._id === currentUser?._id && "hidden"}`}
                color="primary"
                isIconOnly
                variant="faded"
                size="sm"
              >
                <EllipsisHorizontalIcon />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem>Block</DropdownItem>
              <DropdownItem>Report</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
