"use client";

import { usePanel } from "@/app/_context/PanelContext";
import React from "react";
import Settings from "./settings/Settings";
import Profile from "./Profile";
import { useAuth } from "@/app/_context/AuthContext";
import AccountSettings from "./settings/AccountSettings";
import FriendsSection from "../../FriendsSection";
import UserProfile from "../../UserProfile";

const AccountPanel = () => {
  const { switchPanel, activeSubPanel, pushSubPanel, popSubPanel } = usePanel();
  const { subPanel, param } = activeSubPanel || {};
  const { user, logout } = useAuth();

  // Condițional pentru randarea subpanoului activ
  const renderSubPanel = () => {
    switch (subPanel) {
      case "Settings":
        return (
          <Settings user={user} goBack={popSubPanel} goTo={pushSubPanel} />
        );
      case "AccountSettings":
        return <AccountSettings user={user} goBack={popSubPanel} />;
      case "FriendsSection":
        return (
          <FriendsSection currUser={user} goBack={popSubPanel} />
        );
      case "Profile":
        return <UserProfile currentUser={param} />;
      default:
        return (
          <Profile
            user={user}
            logout={logout}
            pushSubPanel={pushSubPanel}
            switchPanel={switchPanel}
          />
        );
    }
  };

  return <div className="h-full">{renderSubPanel()}</div>;
};

export default AccountPanel;
