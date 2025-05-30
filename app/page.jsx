"use client";

import { useEffect, useState } from "react";
import { usePanel } from "./_context/PanelContext";
import { useRouter } from "next/navigation";
import { useAuth } from "./_context/AuthContext";
import LeftSidebar from "./_components/LeftSidebar";
import ChatsPanel from "./_components/page-components/chats/ChatsPanel";
import GroupsPanel from "./_components/page-components/groups/GroupsPanel";
import NotificationsPanel from "./_components/page-components/notifications/NotificationsPanel";
import HomePanel from "./_components/page-components/home/HomePanel";
import Bottombar from "./_components/Bottombar";
import AccountPanel from "./_components/page-components/account/AccountPanel";
import SearchPanel from "./_components/search/SearchPanel";
import { Skeleton } from "@heroui/react";
import LoadingScreen from "./_components/LoadingScreen";

const Landing = () => {
  const { activePanel } = usePanel();
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAuth();
  const [viewportHeight, setViewportHeight] = useState("100vh");

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/login");
    }

    const updateHeight = () => {
      setViewportHeight(`${window.innerHeight}px`);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, [isAuthenticated, router]);

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <div
      className={`w-full flex flex-col md:flex-row ${!user && "hidden"}`}
      style={{ height: viewportHeight }}
    >
      <LeftSidebar />

      <div className="flex-1 flex overflow-y-auto h-full">
        {/* Sectiunea activă */}
        <div
          className={`flex h-full dark:bg-gray-950 w-full md:!max-w-[350px] lg:!max-w-[450px] ${
            activePanel === "Home" && "hidden"
          }`}
        >
          <div className={`flex-1 ${activePanel !== "Search" && "hidden"}`}>
            <SearchPanel />
          </div>
          <div
            className={`flex-1 h-full ${activePanel !== "Chats" && "hidden"}`}
          >
            <ChatsPanel />
          </div>
          <div className={`flex-1 ${activePanel !== "Groups" && "hidden"}`}>
            <GroupsPanel />
          </div>
          <div
            className={`flex-1 ${activePanel !== "Notifications" && "hidden"}`}
          >
            <NotificationsPanel />
          </div>
          <div className={`flex-1 ${activePanel !== "Account" && "hidden"}`}>
            <AccountPanel />
          </div>
        </div>

        {/* Home (activ implicit pe MD+) */}
        <div
          className={`flex-1 overflow-y-auto ${
            activePanel === "Home" ? "block" : "hidden md:block"
          }`}
        >
          <HomePanel />
        </div>
      </div>

      <Bottombar />
    </div>
  );
};

export default Landing;
