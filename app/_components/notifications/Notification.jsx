"use client";

// components/Notification.js

import { multiFormatDateString } from "../../services/utils";
import FriendRequest from "./FriendRequest";
import AcceptedFriendRequest from "./AcceptedFriendRequest";
import { usePanel } from "../../_context/PanelContext";
import { useAuth } from "../../_context/AuthContext";
import { acceptFriendRequest } from "@/app/api/friends";
import { useEffect, useState } from "react";
import { getUserById } from "@/app/services/userService";

const Notification = ({ notification }) => {
  const { pushSubPanel, switchPanel } = usePanel();
  const { user, fetchProfile } = useAuth();
  const [notificationMetadata, setNotificationMetadata] = useState(null);

  useEffect(() => {
    const getNotificationMetadata = async () => {
      if (notification.type === "friend_request") {
        const sender = await getUserById(notification.data.senderId);
        setNotificationMetadata(sender);
      } else if (notification.type === "friend_request_accepted") {
        const acceptedBy = await getUserById(notification.data.acceptedBy);
        setNotificationMetadata(acceptedBy);  
      }
    }

    getNotificationMetadata();
  }, [notification]);

  const handleAddBack = async (notification) => {
    try {
      // Add back friend request notification
      const response = await acceptFriendRequest(
        user?._id,
        notification.data.senderId
      );
      await fetchProfile();
      if (!response?.success) {
        toast.error(response?.message);
      }
    } catch (error) {
      console.error("Error adding back friend request: ", error);
    }
  };

  return (
    <div
      className={`flex p-4 mb-2 flex-col w-full items-end gap-y-2 rounded-lg ${
        notification.read
          ? "bg-white"
          : "bg-opacity-30 dark:bg-opacity-30 bg-yellow-100 dark:bg-yellow-100 "
      } dark:bg-gray-900 shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer`}
    >
      {notification.type === "friend_request" ? (
        <FriendRequest
          user={user}
          onClick={() => {
            pushSubPanel("Profile", notificationMetadata);
          }}
          sender={notificationMetadata}
          onAction={() => handleAddBack(notification)}
        />
      ) : notification.type === "friend_request_accepted" ? (
        <AcceptedFriendRequest
          user={user}
          onClick={() => pushSubPanel("Profile", notificationMetadata)}
          acceptedBy={notificationMetadata}
          onAction={() => {
            switchPanel("Chats");
          }}
        />
      ) : (
        <div>Unknown Notification Type</div>
      )}

      <div className="text-xs text-gray-400">
        {multiFormatDateString(notification.createdAt)}
      </div>
    </div>
  );
};

export default Notification;
