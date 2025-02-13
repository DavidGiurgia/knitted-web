import {
  ChartBarIcon,
  ChatBubbleLeftIcon,
  InformationCircleIcon,
  PencilIcon,
  PencilSquareIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
  TrophyIcon,
} from "@heroicons/react/16/solid";
import { Tab, Tabs } from "@heroui/react";
import React from "react";

const InteractionsTabs = ({
  selectedTab,
  setSelectedTab,
  isVertical = false,
}) => {
  return (
    <Tabs
      isVertical={isVertical}
      onSelectionChange={setSelectedTab}
      variant="light"
      color="primary"
      fullWidth
      size="lg"
      selectedKey={selectedTab}
    >
      <Tab
        key="q&a"
        title={
          <div className="flex items-center gap-x-2 text-xl">
            <QuestionMarkCircleIcon className="size-6" />
            <span className=" ">Q&A</span>
          </div>
        }
      />
      <Tab
        key="chat"
        className=""
        title={
          <div className="flex items-center gap-x-2 text-xl ">
            <ChatBubbleLeftIcon className="size-6 " />
            <span className=" ">Chat</span>
          </div>
        }
      />
      <Tab
        key="polls"
        title={
          <div className="flex items-center gap-x-2 text-xl ">
            <ChartBarIcon className="size-6" />
            <span className="">Polls</span>
          </div>
        }
      />
    </Tabs>
  );
};

export default InteractionsTabs;
