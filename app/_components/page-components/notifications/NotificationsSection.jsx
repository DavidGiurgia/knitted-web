"use client";

import { useAuth } from "@/app/_context/AuthContext";
import { getNotificationsForUser } from "@/app/services/notifications";
import { ArrowLeftIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Notification from "../../notifications/Notification";
import { markAllNotificationsAsRead } from "@/app/api/notifications";
import { acceptFriendRequest } from "@/app/api/friends";
import { getUserById } from "@/app/services/userService";

const NotificationsSection = ({switchPanel, resetPanel }) => {
  const { user, fetchProfile } = useAuth(); // Obține utilizatorul curent
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      // Fetch notifications
      const userNotifications = await getNotificationsForUser(user._id);

      // Mark notifications as read in one go
      await markAllNotificationsAsRead(user._id);

      // Update state
      setNotifications(userNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  // Handle Add back for friend requests
  const handleAddBack = async (notification) => {
    try {
      // Add back friend request notification
      const response = await acceptFriendRequest(
        user?._id,
        notification.data.sender?._id
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
    <div className="w-full h-full p-4 overflow-y-auto flex flex-col">
      <div className="flex items-center justify-between gap-x-6">
        <Button
          className="md:hidden"
          onPress={() => {switchPanel("Account"); resetPanel();}}
          variant="light"
          isIconOnly
        >
          <ArrowLeftIcon className="size-5" />
        </Button>
        <div className="text-xl">Notifications</div>

        
      </div>

      <div className={`mt-4 w-full flex-1 flex flex-col items-center ${loading || notifications.length === 0 ? "justify-center" : ""}`}>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center text-gray-500">No notifications yet!</div>
        ) : (
          notifications.map((notification) => (
            <Notification
              key={notification._id}
              notification={notification}
             
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsSection;
