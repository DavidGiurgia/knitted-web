"use client";

import { usePanel } from "@/app/_context/PanelContext";
import React from "react";
import GroupsSection from "./GroupsSection";
import CreateGroupSection from "./CreateGroupSection";

const GroupsPanel = () => {
  const { activeSubPanel, popSubPanel } = usePanel();
  const { subPanel, param } = activeSubPanel || {};


  const renderSubPanel = () => {
    switch (subPanel) {
      case "CreateGroup":
        return <CreateGroupSection goBack={popSubPanel} />;

      default:
        return <GroupsSection />;
    }
  };
  return <div className="h-full">{renderSubPanel()}</div>;
};

export default GroupsPanel;
