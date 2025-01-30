"use client";

import {
  HomeIcon as HomeOutline,
  MagnifyingGlassIcon as SearchOutline,
  ChatBubbleLeftRightIcon as ChatOutline,
  UserGroupIcon as GroupOutline,
  BellIcon as BellOutline,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";

import {
  HomeIcon as HomeSolid,
  MagnifyingGlassIcon as SearchSolid,
  ChatBubbleLeftRightIcon as ChatSolid,
  UserGroupIcon as GroupSolid,
  BellIcon as BellSolid,
} from "@heroicons/react/24/solid";

import React, { useState } from "react";
import { useAuth } from "../_context/AuthContext";
import { usePanel } from "../_context/PanelContext";
import { Avatar, Button, Image, Tooltip } from "@heroui/react";
import InitialsAvatar from "./InitialsAvatar";

const links = [
  { label: "Home", iconOutline: HomeOutline, iconSolid: HomeSolid },
  { label: "Search", iconOutline: SearchOutline, iconSolid: SearchSolid },
  { label: "Chats", iconOutline: ChatOutline, iconSolid: ChatSolid },
  { label: "Groups", iconOutline: GroupOutline, iconSolid: GroupSolid },
  { label: "Notifications", iconOutline: BellOutline, iconSolid: BellSolid },
  { label: "Account", isAvatar: true },
];

const LeftSidebar = () => {
  const { activePanel, switchPanel, resetPanel, resetSession } = usePanel();
  const { logout, user } = useAuth();

  const handleLinkClick = (label) => {
    if (activePanel === label) {
      resetPanel();
    }
    switchPanel(label);
  };

  const handleLogoutClick = () => {
    logout();
    resetSession();
  };

  return (
    <div className="hidden md:flex min-h-[100vh]">
      <nav className="overflow-y-auto min-h-[100vh] w-20 flex-shrink-0 flex flex-col items-center justify-between bg-white dark:bg-gray-950 border-r border-gray-300 dark:border-gray-800 py-6">
        <div className="space-y-16">
          <div
            className="flex justify-center"
            onClick={() => {
              handleLinkClick("Home");
            }}
          >
            <Image
              isBlurred
              width={30}
              src="/assets/Z-logo.svg"
              alt="Logo"
              className="mt-4 rounded-none"
            />
          </div>

          <div className="flex flex-col space-y-2">
            {links.map(
              ({
                label,
                iconOutline: IconOutline,
                iconSolid: IconSolid,
                isAvatar,
              }) => (
                <Tooltip
                  placement="right"
                  showArrow
                  content={label}
                  key={label}
                  delay={1000}
                >
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={() => handleLinkClick(label)}
                    className={`w-12 h-12 rounded-lg 
                 ${
                   activePanel === label ? "!bg-gray-100 dark:!bg-gray-800" : ""
                 }`}
                  >
                    {isAvatar ? (
                      <div
                        className={`${
                          activePanel === "Account" &&
                          "ring-1 ring-offset-1 rounded-full  ring-primary"
                        }`}
                      >
                        {user?.avatarUrl ? (
                          <Avatar
                            showFallback
                            src={user.avatarUrl}
                            radius="full"
                            size="sm"
                            className="w-8 h-8"
                          />
                        ) : (
                          <InitialsAvatar nickname={user?.fullname} size={32} />
                        )}
                      </div>
                    ) : activePanel === label ? (
                      <IconSolid className="w-6 h-6 text-primary" />
                    ) : (
                      <IconOutline className="w-6 h-6 " />
                    )}
                  </Button>
                </Tooltip>
              )
            )}
          </div>
        </div>

        <Tooltip placement="right" showArrow content="Logout">
          <Button
            variant="light"
            isIconOnly
            onPress={() => handleLogoutClick()}
            className="w-12 h-12 rounded-lg "
          >
            <ArrowRightStartOnRectangleIcon className="w-6 h-6 " />
          </Button>
        </Tooltip>
      </nav>
    </div>
  );
};

export default LeftSidebar;
