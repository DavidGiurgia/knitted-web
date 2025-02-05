"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../_context/AuthContext";
import { fetchFriends } from "../services/friendsService";
import { Avatar, Badge, Chip, Input } from "@heroui/react";
import InitialsAvatar from "./InitialsAvatar";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/16/solid";

export default function SelectFriends({
  setSelectedFriends,
}) {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [selectedFriends, setSelectedFriendsState] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const getFriends = async () => {
    setLoading(true);
    try {
      const response = await fetchFriends(user?._id);
      setFriends(response || []);
      setFilteredFriends(response || []);
    } catch (error) {
      console.error("Error fetching friends:", error);
      setFriends([]);
      setFilteredFriends([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getFriends();
    }
  }, [user]);

  useEffect(() => {
    setFilteredFriends(
      friends.filter((friend) =>
        friend.fullname.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, friends]);

  const toggleFriendSelection = (friend) => {
    setSelectedFriendsState((prev) => {
      const isSelected = prev.some((f) => f._id === friend._id);
      const updatedSelection = isSelected
        ? prev.filter((f) => f._id !== friend._id)
        : [...prev, friend];
      setSelectedFriends(updatedSelection.map((f) => f._id));
      return updatedSelection;
    });
  };

  return (
    <div className="w-full flex flex-col gap-y-1">
      <div className="max-w-full flex gap-x-2 p-2 overflow-x-auto scrollbar-hide md:scrollbar-default">
        {selectedFriends.map((friend) => (
          <div key={friend._id}>
            <div
              onClick={() => toggleFriendSelection(friend)}
              className="p-1 flex flex-col items-center justify-center gap-y-1 "
            >
              <Badge
                size="lg"
                isOneChar
                content={<XMarkIcon className="size-4" />}
                placement="bottom-right"
              >
                {friend?.avatarUrl ? (
                  <Avatar
                    size="lg"
                    alt={friend.username}
                    className="flex-shrink-0"
                    showFallback
                    src={friend.avatarUrl}
                  />
                ) : (
                  <InitialsAvatar nickname={friend?.fullname} size={56} />
                )}
              </Badge>
              <span className="text-xs text-center text-wrap w-14 text-gray-800 dark:text-gray-200">
                {friend.fullname}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Input
        startContent={
          <MagnifyingGlassIcon className="size-5 flex-shrink-0 text-gray-500 " />
        }
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="my-1"
      />

      <label className={`${search && "hidden"} text-sm mt-4`}>Suggested</label>

      <div className="grid grid-cols-1 gap-2 overflow-y-auto md:max-h-64">
        {filteredFriends.map((friend) => (
          <div
            key={friend._id}
            className={` flex items-center gap-2 p-2 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer ${
              selectedFriends.some((f) => f._id === friend._id)
                ? "bg-primary bg-opacity-5"
                : ""
            }`}
            onClick={() => {
              toggleFriendSelection(friend);
              setSearch("");
            }}
          >
            {friend.avatarUrl ? (
              <Avatar
                alt={friend.username}
                className="flex-shrink-0"
                showFallback
                src={friend.avatarUrl}
              />
            ) : (
              <InitialsAvatar nickname={friend.fullname} size={40} />
            )}
            <div className="flex flex-col">
              <span className="text-small">
                {friend.fullname || friend.username}
              </span>
              <span className="text-tiny text-default-400">{friend.email}</span>
            </div>
          </div>
        ))}

        {search && filteredFriends.length === 0 && (
          <div className="text-center my-10 text-gray-500">
            No results found
          </div>
        )}
      </div>
    </div>
  );
}
