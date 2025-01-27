"use client";
import React, { useEffect, useState } from "react";
import UserListItem from "./UserListItem";
import { fetchFriends } from "../services/friendsService";
import { useAuth } from "../_context/AuthContext";
import { usePanel } from "../_context/PanelContext";

const FriendsList = ({ currUser, onSelect, mutualOnly }) => {
  const { user } = useAuth();
  
  const [friends, setFriends] = useState([]);
  const [mutualFriends, setMutualFriends] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Obține avatarurile prietenilor din relații
    const fetchFriendAvatars = async () => {
      setLoading(true);
      try {
        let friendData = await fetchFriends(currUser?._id);
        const mutualOnly = friendData.filter((friend) =>
          user.friendsIds.includes(friend._id)
        );
        setMutualFriends(mutualOnly);
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
    <div className="flex flex-col w-full gap-y-4">
      {loading && (
        <p className="flex  w-full items-center justify-center">
          Loading friends...
        </p>
      )}

      {!loading && friends?.length === 0 && <p>No friends found.</p>}

      {mutualFriends?.length > 0 && (
        <div id="activity" className="flex flex-col gap-y-2">
          <label className="text-sm text-gray-500 " htmlFor="activity">
            Mutual
          </label>
          {mutualFriends.map((friend) => (
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
        </div>
      )}

      {!mutualOnly && friends?.length > 0 && (
        <div id="activity" className="flex flex-col gap-y-2">
          <label className="text-sm text-gray-500 " htmlFor="activity">
            All
          </label>
          {friends.map((friend) => (
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
        </div>
      )}

      {currUser?.friendsIds && currUser?.friendsIds.length === 0 && (
        <p className="flex w-full items-center justify-center">
          No friends yet.
        </p>
      )}
    </div>
  );
};

export default FriendsList;
