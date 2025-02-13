"use client";

import React from "react";
import { useAuth } from "@/app/_context/AuthContext";
import { usePanel } from "@/app/_context/PanelContext";
import HomeSection from "./HomeSection";
import CreatePostSection from "../../post-items/CreatePostSection";
import ImageEditor from "../../modals/ImageEditor";
import PostSettingsSection from "../../post-items/PostSettingsSection";

const HomePanel = () => {
  const { user } = useAuth();
  const { activeSubPanel, switchPanel, activePanel } = usePanel();

  const { subPanel, param } = activeSubPanel || {};
  return (
    <div className="h-full">
      <div
        className={`h-full ${
          activeSubPanel === "Home" ? "block" : "hidden md:block"
        }`}
      >
        <HomeSection
          switchPanel={switchPanel}
          rightSection={activeSubPanel === "Home"}
        />
      </div>
      <div className={`h-full ${subPanel !== "CreatePost" && "hidden"}`}>
        <CreatePostSection initialTab={param} />
      </div>
      <div className={`h-full ${subPanel !== "PostSettings" && "hidden"}`}>
        <PostSettingsSection params={param} />
      </div>
      <div className={`h-full ${subPanel !== "EditImage" && "hidden"}`}>
        <ImageEditor imageSrc={param} />
      </div>
    </div>
  );
};

export default HomePanel;
