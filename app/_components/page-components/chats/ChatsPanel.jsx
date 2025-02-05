"use client";

import { usePanel } from "@/app/_context/PanelContext";
import React from "react";
import UserProfile from "../../UserProfile";
import ChatsList from "./ChatsList";
import ChatRoom from "./ChatRoom";
import { useKeyboard } from "@/app/_context/KeyboardContext";
import NewChatSection from "./NewChatSection";

const ChatsPanel = () => {
  const { activeSubPanel, pushSubPanel, popSubPanel, screenSize } = usePanel();
  const { subPanel, param } = activeSubPanel || {};
  const { isKeyboardOpen, keyboardHeight } = useKeyboard();

  const renderSubPanel = () => {
    switch (subPanel) {
      case "Profile":
        return <UserProfile currentUser={param} />;
      case "NewChatSection":
        return (
          <NewChatSection pushSubPanel={pushSubPanel} goBack={popSubPanel} />
        );
      case "FriendsSection":
      case "ChatRoom":
        return <ChatRoom room={param} goBack={popSubPanel} />;
      default:
        return (
          <ChatsList pushSubPanel={pushSubPanel} screenSize={screenSize} />
        );
    }
  };
  return <div className="h-full">{renderSubPanel()}</div>;
};

export default ChatsPanel;
