"use client";

import { multiFormatDateString } from "../../services/utils";
import FriendRequest from "./FriendRequest";
import AcceptedFriendRequest from "./AcceptedFriendRequest";
import { usePanel } from "../../_context/PanelContext";
import { useAuth } from "../../_context/AuthContext";
import { acceptFriendRequest } from "@/app/api/friends";
import { useEffect, useState } from "react";
import { getUserById } from "@/app/services/userService";
import GroupInvitation from "./GroupInvitation";
import { Skeleton } from "@heroui/react";

const Notification = ({ notification }) => {
  const { pushSubPanel, switchPanel } = usePanel();
  const { user, fetchProfile } = useAuth();
  const [notificationMetadata, setNotificationMetadata] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getNotificationMetadata = async () => {
      try {
        if (notification.type === "friend_request") {
          const sender = await getUserById(notification.data.senderId);
          setNotificationMetadata(sender);
        } else if (notification.type === "friend_request_accepted") {
          const acceptedBy = await getUserById(notification.data.acceptedBy);
          setNotificationMetadata(acceptedBy);
        } else if (notification.type === "group_invitation") {
          // Handle group invitation if needed
        }
      } catch (error) {
        console.error("Error fetching notification metadata: ", error);
      } finally {
        setLoading(false);
      }
    };

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
      } dark:bg-gray-950 shadow-md hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer`}
    >
      {loading ? (
        <div className="w-full">
          <Skeleton className="h-4 mb-2 rounded" />
          <Skeleton className="h-4 mb-2 rounded" />
          <Skeleton className="h-4 mb-2 rounded" />
        </div>
      ) : (
        <>
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
          ) : notification.type === "group_invitation" ? (
            <GroupInvitation user={user} notification={notification} />
          ) : (
            <div> Unknown Notification Type </div>
          )}
        </>
      )}

      <div className="text-xs text-gray-400">
        {loading ? <Skeleton className="w-20 h-4 rounded" /> : multiFormatDateString(notification.createdAt)}
      </div>
    </div>
  );
};

export default Notification;