'use client';

import { useEffect, useState } from "react";
import { useAuth } from "../_context/AuthContext";
import { fetchFriends } from "../services/friendsService";
import { Avatar, Chip, Select, SelectItem } from "@nextui-org/react";

export default function SelectFriends({ variant, placeholder = "Select friends", setSelectedFriends }) {
    const { user } = useAuth();
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
  
    const getFriends = async () => {
      setLoading(true);
      try {
        const response = await fetchFriends(user?._id);
        setFriends(response || []); // Ensure a valid array
      } catch (error) {
        console.error("Error fetching friends:", error);
        setFriends([]); // Fallback to an empty array 
      } finally {
        setLoading(false); 
      }
    };
  
    useEffect(() => {
      if (user) {
        getFriends();
      }
    }, [user]);

    return (
      <Select
        classNames={{
          base: "w-full",
          trigger: "min-h-12 py-2",
        }}
        isMultiline={true}
        items={loading ? [] : friends}
        //label='custom'
        labelPlacement="outside"
        placeholder={loading ? "Loading friends..." : placeholder}
        renderValue={(selectedItems) => (
          <div className="flex flex-wrap gap-2">
            {selectedItems.map((item) => (
              <Chip key={item.key}>{item.data.username}</Chip>
            ))}
          </div>
        )}
        selectionMode="multiple"
        variant={variant || "bordered"}
        onSelectionChange={(selectedKeys) => setSelectedFriends(selectedKeys)}
      >
        {(friend) => (
          <SelectItem key={friend._id} textValue={friend.username}>
            <div className="flex gap-2 items-center">
              <Avatar
                alt={friend.username}
                className="flex-shrink-0"
                size="sm"
                showFallback
                src={friend.avatarUrl}
              />
              <div className="flex flex-col">
                <span className="text-small">{friend.fullname || friend.username}</span>
                <span className="text-tiny text-default-400">{friend.email}</span>
              </div>
            </div>
          </SelectItem>
        )}
      </Select>
    );
  }
  