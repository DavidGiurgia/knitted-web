import React from "react";
import CreatePostInput from "../../post-items/CreatePostInput";
import FeedHeader from "./FeedHeader";
import FeedItem from "./FeedItem";

const FeedContainer = ({ switchPanel }) => {
  return (
    <div className="max-w-[600px]  h-full flex-1 overflow-auto flex flex-col gap-y-2  ">
      <FeedHeader switchPanel={switchPanel} />

      <div className="p-2 pb-0 flex flex-col gap-y-4 h-full">
        <CreatePostInput />
        <FeedItem />
      </div>
    </div>
  );
};

export default FeedContainer;
