"use client";

import { usePanel } from "@/app/_context/PanelContext";
import React from "react";
import UserProfile from "../../UserProfile";
import ChatsList from "./ChatsList";
import ChatRoom from "./ChatRoom";
import NewChatSection from "./NewChatSection";

const ChatsPanel = () => {
  const { activeSubPanel, pushSubPanel, popSubPanel, screenSize } = usePanel();
  const { subPanel, param } = activeSubPanel || {};

  return (
    <div className="h-full relative">
      <div className={`absolute inset-0 ${subPanel === "Profile" ? "block" : "hidden"}`}>
        <UserProfile currentUser={param} />
      </div>
      <div className={`absolute inset-0 ${subPanel === "NewChatSection" ? "block" : "hidden"}`}>
        <NewChatSection pushSubPanel={pushSubPanel} goBack={popSubPanel} />
      </div>
      <div className={`absolute inset-0 ${subPanel === "FriendsSection" || subPanel === "ChatRoom" ? "block" : "hidden"}`}>
        <ChatRoom room={param} goBack={popSubPanel} />
      </div>
      <div className={`absolute inset-0 ${!subPanel || (subPanel !== "Profile" && subPanel !== "NewChatSection" && subPanel !== "FriendsSection" && subPanel !== "ChatRoom") ? "block" : "hidden"}`}>
        <ChatsList pushSubPanel={pushSubPanel} screenSize={screenSize} />
      </div>
    </div>
  );
};

export default ChatsPanel;