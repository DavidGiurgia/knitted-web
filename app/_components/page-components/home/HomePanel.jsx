"use client";

import React from "react";
import { useAuth } from "@/app/_context/AuthContext";
import { usePanel } from "@/app/_context/PanelContext";
import HomeSection from "./HomeSection";

const HomePanel = () => {
  const { user } = useAuth();
  const { activeSubPanel, switchPanel } = usePanel();

  const { subPanel, param } = activeSubPanel || {};
  // Condițional pentru randarea subpanoului activ
  const renderSubPanel = () => {
    switch (subPanel) {
      case "Settings":
        return <div>nmc</div>;

      default:
        return <HomeSection  switchPanel={switchPanel} rightSection={activeSubPanel === "Home"}/>;
    }
  };
  return <div className="h-full">{renderSubPanel()}</div>;
};

export default HomePanel;
