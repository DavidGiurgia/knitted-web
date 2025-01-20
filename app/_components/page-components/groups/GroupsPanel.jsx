"use client";

import { usePanel } from "@/app/_context/PanelContext";
import React from "react";
import GroupsSection from "./GroupsSection";

const GroupsPanel = () => {
  const { activeSubPanel } = usePanel();

  return (
    <div className={`h-full ${activeSubPanel !== "Groups" && "hidden"}`}>
      <GroupsSection />
    </div>
  );
};

export default GroupsPanel;
