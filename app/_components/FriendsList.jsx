"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../_context/AuthContext";
import { getUserById } from "../services/userService";
import UserListItem from "./UserListItem";
import { usePanel } from "../_context/PanelContext";

const FriendsList = ({ currUser }) => {
  //const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const { pushSubPanel } = usePanel();

  useEffect(() => {
    // Obține avatarurile prietenilor din relații
    const fetchFriendAvatars = async () => {
      if (!currUser?.friendsIds || currUser.friendsIds.length === 0) return;

      try {
        const friendPromises = currUser.friendsIds.map(
          (friendId) => getUserById(friendId) // Fetch fiecare prieten după ID
        );
        const friendData = await Promise.all(friendPromises);
        setFriends(friendData);
      } catch (error) {
        console.error("Error fetching friend avatars:", error);
        toast.error("Unable to load friend data.");
      }
    };

    fetchFriendAvatars();
  }, [currUser]);

  return (
    <div className="flex flex-col w-full gap-y-2">
      {friends.map((friend) => (
        <div
          className="flex items-center px-2 py-1 justify-between rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          key={friend._id}
          onClick={()=>{pushSubPanel("Profile", friend)}}
        >
          <UserListItem user={friend} />
        </div>
      ))}

      {currUser?.friendsIds && currUser.friendsIds.length === 0 && (
        <p>No friends yet.</p>
      )}

      {!currUser?.friendsIds && (
        <p>A��tepă, ��ncă că ����i a��tepta��i prietenii.</p>
      )}
    </div>
  );
};

export default FriendsList;
