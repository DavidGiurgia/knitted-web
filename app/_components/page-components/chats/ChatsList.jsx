import { Button } from "@nextui-org/react";
import React from "react";

const ChatsList = ({ pushSubPanel }) => {
  return (
    <div className="p-4">
      <div>
        <Button variant="faded" color="primary" className="w-full">
          Start a new conversation
        </Button>
      </div>
    </div>
  );
};

export default ChatsList;
