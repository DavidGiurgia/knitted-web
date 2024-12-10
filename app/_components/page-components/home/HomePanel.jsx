"use client";

import React from "react";
import { ThemeSwitcher } from "../../ThemeSwitcher";
import { useAuth } from "@/app/_context/AuthContext";

const HomePanel = () => {
  const { user } = useAuth();
  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
      <ThemeSwitcher />
      <div>{user?.username || "No user"}</div>
      <input type="text" />
    </div>
  );
};

export default HomePanel;
