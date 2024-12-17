'use client';

import { useAuth } from "@/app/_context/AuthContext";
import {
  getNotificationsForUser,
  markNotificationAsReadById,
  removeNotificationById,
} from "@/app/services/notifications";
import {
  ArrowLeftIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Notification from "../../Notification";
import { markAllNotificationsAsRead } from "@/app/api/notifications";
import { acceptFriendRequest } from "@/app/api/friends";

const NotificationsSection = ({ pushSubPanel, switchPanel }) => {
  const { user } = useAuth(); // Obține utilizatorul curent
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          // Fetch notifications
          const userNotifications = await getNotificationsForUser(user._id);
          setNotifications(userNotifications);

          // Mark all notifications as read
          await markAllNotificationsAsRead(user._id);
          setNotifications(
            (prev) => prev.map((n) => ({ ...n, read: true })) // Update the state to reflect read status
          );
        } catch (error) {
          console.error("Error fetching notifications:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchNotifications();
  }, [user]);

  // Handle Add back for friend requests
  const handleAddBack = async (notification) => {
    try{
      // Add back friend request notification
      const response = await acceptFriendRequest(user?._id, notification.metadata.sender?._id);
      await removeNotificationById(notification?._id);
      setNotifications((prev) => prev.filter((n) => n._id !== notification._id));
      toast.success(response?.message);
    } 
    catch(error){
      console.error("Error adding back friend request: ", error);
    }
  };

  return (
    <div className="w-full h-full p-4">
      <div className="flex items-center gap-x-6">
        <Button
          className="md:hidden"
          onPress={() => switchPanel("Account")}
          variant="light"
          isIconOnly
        >
          <ArrowLeftIcon className="size-5" />
        </Button>
        <div className="text-xl">Notifications</div>
      </div>

      <div className="mt-4 w-full flex flex-col items-center justify-center">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center text-gray-500">No notifications yet!</div>
        ) : (
          notifications.map((notification) => (
            <div
            onClick={() =>{console.log("type: " + notification.type + ", sender: " + notification.metadata.sender);notification.type === "friend_request" && pushSubPanel("Profile", notification.metadata.sender)}}
              key={notification._id}
              className="flex flex-shrink-0 w-full items-start justify-between  p-4 mb-2 rounded-lg bg-white dark:bg-gray-900 shadow-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Avatar showFallback className="flex-shrink-0 mr-2" src={notification.metadata.sender?.avatarUrl}/>
              <Notification
                notification={notification}
              />
              {notification.type === "friend_request" && (
                <Button
                  size="sm"
                  color="primary"
                  onPress={() => handleAddBack(notification)}
                >
                  Accept
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsSection;
