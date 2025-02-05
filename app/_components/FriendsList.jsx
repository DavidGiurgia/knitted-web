"use client";
import React, { useEffect, useState } from "react";
import UserListItem from "./UserListItem";
import { fetchFriends } from "../services/friendsService";
import { useAuth } from "../_context/AuthContext";
import { Tabs, Tab, Skeleton } from "@heroui/react";

const FriendsList = ({ currUser, onSelect, mutualOnly }) => {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [mutualFriends, setMutualFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(mutualOnly ? "mutual" : "all");

  useEffect(() => {
    const fetchFriendAvatars = async () => {
      setLoading(true);
      try {
        if (!currUser?._id) return;

        let friendData = await fetchFriends(currUser._id);

        if (!user?.friendsIds) return;
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

  const renderFriends = (list) => {
    return list.map((friend) => (
      <div
        className="flex items-center px-2 py-1 justify-between rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
        key={friend._id}
        onClick={() => {
          onSelect(friend);
        }}
      >
        <UserListItem user={friend} />
      </div>
    ));
  };

  const renderSkeletons = () => (
    <div className="flex flex-col gap-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center px-2 py-1 justify-between rounded-lg"
        >
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 ml-4">
            <Skeleton className="w-32 h-4 mb-2 rounded" />
            <Skeleton className="w-48 h-4 rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col w-full gap-y-2">
      <Tabs
        //color='primary'
        variant="light"
        radius="full"
        selectedKey={activeTab}
        onSelectionChange={setActiveTab}
      >
        <Tab key="all" title={`${currUser?.friendsIds?.length} friends`}>
          {loading ? (
            renderSkeletons()
          ) : friends.length === 0 ? (
            <p className="flex w-full items-center justify-center">
              No friends found.
            </p>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {renderFriends(friends)}
            </div>
          )}
        </Tab>
        {currUser?._id !== user?._id && (
          <Tab key="mutual" title={`${mutualFriends?.length} mutual`}>
            {loading ? (
              renderSkeletons()
            ) : mutualFriends.length === 0 ? (
              <p className="flex w-full items-center justify-center">
                No mutual friends found.
              </p>
            ) : (
              <div className="flex-1 overflow-y-auto">
                {renderFriends(mutualFriends)}
              </div>
            )}
          </Tab>
        )}
      </Tabs>

      {currUser?.friendsIds && currUser?.friendsIds.length === 0 && (
        <p className="flex w-full items-center justify-center">
          No friends yet.
        </p>
      )}
    </div>
  );
};

export default FriendsList;