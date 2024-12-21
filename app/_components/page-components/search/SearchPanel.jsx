"use client";

import React from "react";
import SearchSection from "./SearchSection";
import ProfileSection from "../../ProfileSection";
import { usePanel } from "@/app/_context/PanelContext";
import FriendsSection from "../../FriendsSection";
import { useAuth } from "@/app/_context/AuthContext";
import UserProfile from "../../UserProfile";

const SearchPanel = () => {
  const { activeSubPanel, pushSubPanel, popSubPanel, switchPanel } = usePanel();
  const { subPanel, param } = activeSubPanel || {};
  const renderSubPanel = () => {
    switch (subPanel) {
      case "Profile":
        return <UserProfile currentUser={param} />;
      case "FriendsSection":
        return <FriendsSection currUser={param} goBack={popSubPanel} />;
      default:
        return (
          <SearchSection
            pushSubPanel={pushSubPanel}
          />
        );
    } // End switch subPanel
  };
  return <div className="h-full">{renderSubPanel()}</div>;
};

export default SearchPanel;
