'use client';

import { usePanel } from "@/app/_context/PanelContext";
import React from "react";
import ProfileSection from "../search/ProfileSection";
import NotificationsSection from "./NotificationsSection";

const NotificationsPanel = () => {
  const { activeSubPanel, pushSubPanel, popSubPanel, switchPanel } = usePanel();
  const { subPanel, param } = activeSubPanel || {};
  return (
   <div className="h-full">
  <div className={`h-full ${activeSubPanel !== "Notifications" && "hidden"}`}>
    <NotificationsSection pushSubPanel={pushSubPanel} switchPanel={switchPanel}/>
  </div>
  <div className={`${subPanel !== "Profile" && "hidden"}`}>
    <ProfileSection currentUser={param} goBack={popSubPanel}/>
  </div>
</div>
  );
};

export default NotificationsPanel;
