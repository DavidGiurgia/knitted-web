"use client";

import { usePanel } from "@/app/_context/PanelContext";
import React from "react";
import NotificationsSection from "./NotificationsSection";
import FriendsSection from "../../FriendsSection";
import { useAuth } from "@/app/_context/AuthContext";
import UserProfile from "../../UserProfile";

const NotificationsPanel = () => {
  const { activeSubPanel, pushSubPanel, popSubPanel, switchPanel } = usePanel();
  const { subPanel, param } = activeSubPanel || {};
  const { user } = useAuth();

  const renderSubPanel = () => {
    switch (subPanel) {
      case "Profile":
        return <UserProfile currentUser={param} />;
      case "FriendsSection":
        return (
          <FriendsSection currUser={user} goBack={popSubPanel} />
        );
      default:
        return (
          <NotificationsSection
            pushSubPanel={pushSubPanel}
            switchPanel={switchPanel}
          />
        );
    } // End switch subPanel
  };

  return <div className="h-full">{renderSubPanel()}</div>;
};

export default NotificationsPanel;
