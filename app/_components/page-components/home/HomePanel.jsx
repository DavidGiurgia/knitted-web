"use client";

import React from "react";
import { useAuth } from "@/app/_context/AuthContext";

const HomePanel = () => {
  const { user } = useAuth();
  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
  
      <div>{`${user?.username} has ${user?.friendsIds.length || "no"} friends`}</div>
    </div>
  );
};

export default HomePanel;
