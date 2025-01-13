"use client";
import React, { useEffect, useState } from "react";
import UserListItem from "./UserListItem";
import { fetchFriends } from "../services/friendsService";
import { useAuth } from "../_context/AuthContext";

const FriendsList = ({ currUser, onSelect, mutualOnly }) => {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Obține avatarurile prietenilor din relații
    const fetchFriendAvatars = async () => {
      setLoading(true);
      try {
        let friendData = await fetchFriends(currUser?._id);
        if (mutualOnly && user) {
          friendData = friendData.filter((friend) =>
            user.friendsIds.includes(friend._id)
          );
        }
        setFriends(friendData);
      } catch (error) {
        console.error("Error fetching friend avatars:", error);
        toast.error("Unable to load friend data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFriendAvatars();
  }, [currUser]);

  return (
    <div className="flex flex-col w-full gap-y-2 ">
      {loading && <p className="flex  w-full items-center justify-center">Loading friends...</p>}
      
      {!loading && friends?.length === 0 && (
        <p>No friends found.</p>
      )}
      {friends?.length > 0 &&
        friends.map((friend) => (
          <div
            className="flex items-center px-2 py-1 justify-between rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            key={friend._id}
            onClick={() => {
              onSelect(friend);
            }}
          >
            <UserListItem user={friend} />
          </div>
        ))}

      {currUser?.friendsIds && currUser?.friendsIds.length === 0 && (
        <p className="flex w-full items-center justify-center">No friends yet.</p>
      )}
    </div>
  );
};

export default FriendsList;
