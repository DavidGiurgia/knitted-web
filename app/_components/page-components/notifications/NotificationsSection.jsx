"use client";

import { useAuth } from "@/app/_context/AuthContext";
import { getNotificationsForUser } from "@/app/services/notifications";
import { ArrowLeftIcon, Bars3Icon } from "@heroicons/react/24/outline";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import Notification from "../../notifications/Notification";
import { markAllNotificationsAsRead } from "@/app/api/notifications";

const NotificationsSection = ({ switchPanel }) => {
  const { user, fetchProfile } = useAuth(); // Obține utilizatorul curent
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      // Fetch notifications
      const userNotifications = await getNotificationsForUser(user._id);

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

    //settimeout and after 10 seconds mark all as read
    setTimeout(handleMarkAllAsRead, 10000);

    return () => {
      clearTimeout(handleMarkAllAsRead);
    };
  }, [user]);

  const handleMarkAllAsRead = async () => {
    if (!user) return;

    try {
      // Mark all notifications as read
      await markAllNotificationsAsRead(user._id);

      // Update state locally
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <div className="w-full h-full p-4 overflow-y-auto flex flex-col">
      <div className="flex items-center justify-between gap-x-6">
        <Button
          className="md:hidden"
          onPress={() => {
            switchPanel("Home");
          }}
          variant="light"
          isIconOnly
        >
          <ArrowLeftIcon className="size-5" />
        </Button>
        <div className="text-xl">Notifications</div>

        <Dropdown>
          <DropdownTrigger>
            <Button variant="light" isIconOnly>
              <Bars3Icon className="size-6" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem
              variant="faded"
              key="Mark all as read"
              onPress={handleMarkAllAsRead}
            >
              Mark all as read
            </DropdownItem>
            <DropdownItem
              variant="faded"
              key="Settings"
              onPress={() => {
                // Go to settings panel
                switchPanel("Settings");
              }}
            >
              Settings
            </DropdownItem>
            <DropdownItem
              description="Help and support"
              variant="faded"
              key="Help and support"
              onPress={() => {
                // Go to help and support panel
                switchPanel("HelpAndSupport");
              }}
            >
              Help
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <div
        className={`mt-4 w-full flex-1 flex flex-col items-center ${
          loading || notifications.length === 0 ? "justify-center" : ""
        }`}
      >
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center text-gray-500">No notifications yet!</div>
        ) : (
          notifications.map((notification) => (
            <Notification key={notification._id} notification={notification} />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsSection;
