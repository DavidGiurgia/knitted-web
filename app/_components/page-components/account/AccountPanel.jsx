"use client";

import { usePanel } from "@/app/_context/PanelContext";
import React from "react";
import Settings from "./settings/Settings";
import Profile from "./Profile";
import { useAuth } from "@/app/_context/AuthContext";
import AccountSettings from "./settings/AccountSettings";
import FriendsSection from "../../FriendsSection";
import UserProfile from "../../UserProfile";
import EditProfileSection from "./EditProfileSection";
import CreatePostSection from "../home/CreatePostSection";

const AccountPanel = () => {
  const {
    switchPanel,
    activeSubPanel,
    pushSubPanel,
    popSubPanel,
    resetSession,
  } = usePanel();
  const { subPanel, param } = activeSubPanel || {};
  const { user, logout } = useAuth();

  // Condițional pentru randarea subpanoului activ
  const renderSubPanel = () => {
    switch (subPanel) {
      case "CreatePost":
        return <CreatePostSection />;
      case "Settings":
        return (
          <Settings user={user} goBack={popSubPanel} goTo={pushSubPanel} />
        );
      case "AccountSettings":
        return <AccountSettings user={user} goBack={popSubPanel} />;
      case "EditProfile":
        return <EditProfileSection />;
      case "FriendsSection":
        return (
          <FriendsSection
            currUser={param}
            goBack={popSubPanel}
            onSelect={(friend) => pushSubPanel("Profile", friend)}
          />
        );
      case "MutualFriendsSection":
        return (
          <FriendsSection currUser={param} goBack={popSubPanel} mutualOnly />
        );
      case "Profile":
        return <UserProfile currentUser={param} />;
      default:
        return (
          <Profile
            user={user}
            logout={() => {
              logout();
              resetSession();
            }}
            pushSubPanel={pushSubPanel}
            switchPanel={switchPanel}
          />
        );
    }
  };

  return <div className="h-full">{renderSubPanel()}</div>;
};

export default AccountPanel;
