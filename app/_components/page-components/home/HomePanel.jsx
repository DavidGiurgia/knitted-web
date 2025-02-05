"use client";

import React from "react";
import { useAuth } from "@/app/_context/AuthContext";
import { usePanel } from "@/app/_context/PanelContext";
import HomeSection from "./HomeSection";
import CreatePostSection from "./CreatePostSection";

const HomePanel = () => {
  const { user } = useAuth();
  const { activeSubPanel, switchPanel } = usePanel();

  const { subPanel, param } = activeSubPanel || {};

  return (
    <div className="h-full ">
      <div className={`h-full ${subPanel !== undefined && subPanel !== "Home" ? 'hidden' : ''}`}>
        <HomeSection
          switchPanel={switchPanel}
          rightSection={activeSubPanel === "Home"}
        />
      </div>
      <div className={`h-full ${subPanel !== "CreatePost" ? 'hidden' : ''}`}>
        <CreatePostSection />
      </div>
    </div>
  );
};

export default HomePanel;