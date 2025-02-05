"use client";

import React from "react";
import SearchSection from "./SearchSection";
import { usePanel } from "@/app/_context/PanelContext";
import FriendsSection from "../FriendsSection";
import UserProfile from "../UserProfile";

const SearchPanel = () => {
  const { activeSubPanel, pushSubPanel, popSubPanel } = usePanel();
  const { subPanel, param } = activeSubPanel || {};

  return (
    <div className="h-full relative">
      <div className={`absolute inset-0 ${subPanel !== undefined ? 'hidden' : ''}`}>
        <SearchSection pushSubPanel={pushSubPanel} />
      </div>
      <div className={`absolute inset-0 ${subPanel !== "Profile" ? 'hidden' : ''}`}>
        <UserProfile currentUser={param} />
      </div>
      <div className={`absolute inset-0 ${subPanel !== "FriendsSection" ? 'hidden' : ''}`}>
        <FriendsSection
          currUser={param}
          goBack={popSubPanel}
          onSelect={(friend) => pushSubPanel("Profile", friend)}
        />
      </div>
      <div className={`absolute inset-0 ${subPanel !== "MutualFriendsSection" ? 'hidden' : ''}`}>
        <FriendsSection
          currUser={param}
          goBack={popSubPanel}
          onSelect={(friend) => pushSubPanel("Profile", friend)}
          mutualOnly={true}
        />
      </div>
    </div>
  );
};

export default SearchPanel;