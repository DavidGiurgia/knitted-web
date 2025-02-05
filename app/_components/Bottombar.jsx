"use client";

import React from "react";
import { usePanel } from "../_context/PanelContext";

import {
  HomeIcon as HomeOutline,
  MagnifyingGlassIcon as SearchOutline,
  ChatBubbleLeftRightIcon as ChatOutline,
  UserGroupIcon as GroupOutline,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeSolid,
  MagnifyingGlassIcon as SearchSolid,
  ChatBubbleLeftRightIcon as ChatSolid,
  UserGroupIcon as GroupSolid,
} from "@heroicons/react/24/solid";
import { Avatar, Button } from "@heroui/react";
import { useAuth } from "../_context/AuthContext";
import InitialsAvatar from "./InitialsAvatar";

const links = [
  { label: "Home", iconOutline: HomeOutline, iconSolid: HomeSolid },
  { label: "Search", iconOutline: SearchOutline, iconSolid: SearchSolid },
  { label: "Chats", iconOutline: ChatOutline, iconSolid: ChatSolid },
  { label: "Groups", iconOutline: GroupOutline, iconSolid: GroupSolid },
  { label: "Account", isAvatar: true },
];

const Bottombar = () => {
  const { activePanel, switchPanel, resetPanel, bottombar } = usePanel();
  const { user } = useAuth();
  const handleLinkClick = (label) => {
    if (activePanel === label) {
      resetPanel();
    }
    switchPanel(label);
  };

  return (
    <div
      className={`${
        !bottombar && "hidden"
      } md:hidden flex w-full flex-shrink-0 bg-white dark:bg-gray-950 border-t border-gray-300 dark:border-gray-800 `}
    >
      {links.map(
        ({
          label,
          iconOutline: IconOutline,
          iconSolid: IconSolid,
          isAvatar,
        }) => (
          <Button
            isIconOnly
            key={label}
            onPress={() => handleLinkClick(label)}
            className={`bg-transparent rounded-none w-full h-16`}
          >
            {isAvatar ? (
              <div
                className={`${
                  activePanel === "Account" &&
                  "ring-1 ring-offset-1 ring-offset-white dark:ring-offset-gray-950 rounded-full  ring-primary"
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
              <IconSolid className="w-8 h-8 text-primary" />
            ) : (
              <IconOutline className="w-8 h-8 " />
            )}
          </Button>
        )
      )}
    </div>
  );
};

export default Bottombar;
