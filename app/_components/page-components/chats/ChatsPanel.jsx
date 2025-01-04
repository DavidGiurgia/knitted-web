'use client';

import { usePanel } from "@/app/_context/PanelContext";
import React from "react";
import UserProfile from "../../UserProfile";
import ChatsList from "./ChatsList";
import ChatRoom from "./ChatRoom";

const ChatsPanel = () => {
  const { switchPanel, activeSubPanel, pushSubPanel, popSubPanel } = usePanel();
    const { subPanel, param } = activeSubPanel || {};

    const renderSubPanel = () => {
      switch (subPanel) {
        case "Profile":
          return <UserProfile currentUser={param} />;
        case "ChatRoom":
          return (
            <ChatRoom currUser={param} goBack={popSubPanel} />
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
