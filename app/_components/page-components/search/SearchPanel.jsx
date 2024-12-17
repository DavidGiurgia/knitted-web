"use client";

import React from "react";
import SearchSection from "./SearchSection";
import ProfileSection from "./ProfileSection";
import { usePanel } from "@/app/_context/PanelContext";

const SearchPanel = () => {
  const { activeSubPanel, pushSubPanel, popSubPanel, switchPanel } = usePanel();
  const { subPanel, param } = activeSubPanel || {};
  return (
    <div className="h-full">
      <div className={`h-full ${activeSubPanel !== "Search" && "hidden"}`}>
        <SearchSection switchPanel={switchPanel} pushSubPanel={pushSubPanel}/>
      </div>
      <div className={`${subPanel !== "Profile" && "hidden"}`}>
        <ProfileSection currentUser={param} goBack={popSubPanel}/>
      </div>
    </div>
  );
};

export default SearchPanel;
