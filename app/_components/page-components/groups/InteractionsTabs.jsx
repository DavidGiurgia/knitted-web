import { ChartBarIcon, ChatBubbleLeftIcon, PencilIcon, PlusIcon, QuestionMarkCircleIcon, TrophyIcon } from "@heroicons/react/16/solid";
import { Tab, Tabs } from "@heroui/react";
import React from "react";

const InteractionsTabs = ({ selectedTab, setSelectedTab }) => {
  return (
    <Tabs
      onSelectionChange={setSelectedTab}
      variant="bordered"
      color="primary"
      className=" w-full flex items-center justify-center "
      size="lg"
      selectedKey={selectedTab}
    >
        <Tab
        key="whiteboard"
        className=""
        title={
          <div className="flex items-center gap-x-2">
            <QuestionMarkCircleIcon className="size-5 " />
            <span className=" ">Whiteboard</span>
          </div>
        }
      />
      <Tab
        key="chat"
        className=""
        title={
          <div className="flex items-center gap-x-2">
            <ChatBubbleLeftIcon className="size-5 " />
            <span className=" ">Chat</span>
          </div>
        }
      />
      <Tab
        key="polls"
        title={
          <div className="flex items-center gap-x-2">
            <ChartBarIcon className="size-5" />
            <span className="">Polls</span>
          </div>
        }
      />
      <Tab
        key="quiz"
        title={
          <div className="flex items-center gap-x-2">
            <TrophyIcon className="size-5" />
            <span className=" ">Quiz</span>
          </div>
        }
      />
    </Tabs>
  );
};

export default InteractionsTabs;
