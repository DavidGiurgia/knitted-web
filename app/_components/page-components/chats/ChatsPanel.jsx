'use client';

import { useAuth } from "@/app/_context/AuthContext";
import { usePanel } from "@/app/_context/PanelContext";
import React from "react";
import UserProfile from "../../UserProfile";
import FriendsSection from "../../FriendsSection";
import ChatsList from "./ChatsList";

const ChatsPanel = () => {
  const { switchPanel, activeSubPanel, pushSubPanel, popSubPanel } = usePanel();
    const { subPanel, param } = activeSubPanel || {};
    const { user, logout } = useAuth();

    const renderSubPanel = () => {
      switch (subPanel) {
        case "Profile":
          return <UserProfile currentUser={param} />;
        case "FriendsSection":
          return (
            <FriendsSection currUser={param} goBack={popSubPanel} />
          );
        default:
          return (
            <ChatsList pushSubPanel={pushSubPanel} />
          );
      }
    }
    return <div className="h-full">{renderSubPanel()}</div>;
};

export default ChatsPanel;
