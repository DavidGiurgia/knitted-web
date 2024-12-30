"use client";

import React from "react";
import SearchSection from "./SearchSection";
import { usePanel } from "@/app/_context/PanelContext";
import FriendsSection from "../../FriendsSection";
import UserProfile from "../../UserProfile";

const SearchPanel = () => {
  const { activeSubPanel, pushSubPanel, popSubPanel } = usePanel();
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
