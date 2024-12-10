"use client";

import { usePanel } from "@/app/_context/PanelContext";
import React from "react";
import Settings from "./settings/Settings";
import Profile from "./Profile";
import { useAuth } from "@/app/_context/AuthContext";

const AccountPanel = () => {
  const { switchPanel,  activeSubPanel , pushSubPanel, popSubPanel} = usePanel();
  const { subPanel } = activeSubPanel || {};
  const { user } = useAuth();

  return (
    <div>
      <div className={`${activeSubPanel !== "Account" && "hidden"}`}>
        <Profile user={user} pushSubPanel={pushSubPanel} switchPanel={switchPanel}/>
      </div>
      <div className={`${subPanel !== "Settings" && "hidden"}`}>
        <Settings goBack={popSubPanel}/>
      </div>
    </div>
  );
};

export default AccountPanel;
