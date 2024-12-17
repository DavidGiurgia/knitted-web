"use client";

import { usePanel } from "@/app/_context/PanelContext";
import React from "react";
import Settings from "./settings/Settings";
import Profile from "./Profile";
import { useAuth } from "@/app/_context/AuthContext";
import AccountSettings from "./settings/AccountSettings";

const AccountPanel = () => {
  const { switchPanel,  activeSubPanel , pushSubPanel, popSubPanel} = usePanel();
  const { subPanel } = activeSubPanel || {};
  const { user, userRelations, logout } = useAuth();

  return (
    <div className="h-full">
      <div className={`h-full ${activeSubPanel !== "Account" && "hidden"}`}>
        <Profile userRelations={userRelations} user={user} logout={logout} pushSubPanel={pushSubPanel} switchPanel={switchPanel}/>
      </div>
      <div className={`${subPanel !== "Settings" && "hidden"}`}>
        <Settings user={user} goBack={popSubPanel} goTo={pushSubPanel}/>
      </div>
      <div className={`${subPanel !== "AccountSettings" && "hidden"}`}>
        <AccountSettings user={user} goBack={popSubPanel} />
      </div>
    </div>
  );
};

export default AccountPanel;
