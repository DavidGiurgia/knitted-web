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
import Image from "next/image";
import { Avatar, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useAuth } from "../_context/AuthContext";

const links = [
  { label: "Home", iconOutline: HomeOutline, iconSolid: HomeSolid },
  { label: "Search", iconOutline: SearchOutline, iconSolid: SearchSolid },
  { label: "Chats", iconOutline: ChatOutline, iconSolid: ChatSolid },
  { label: "Groups", iconOutline: GroupOutline, iconSolid: GroupSolid },
  { label: "Account", isAvatar: true },
];

const Bottombar = () => {
  const { activePanel, switchPanel } = usePanel();
  const {user} = useAuth();
  const handleLinkClick = (label) => {
    switchPanel(label);
  };

  return (
    <div className="md:hidden flex w-full flex-shrink-0 bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 ">
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
            onClick={() => handleLinkClick(label)}
            className={`bg-transparent rounded-none w-full h-16`}
          >
            {isAvatar ? (
              <Avatar
              showFallback
                src={user?.avatarUrl}
                radius="full"
                size="sm"
                className="w-8 h-8"
                isBordered={activePanel === "Account"}
                color="primary"
              />
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
