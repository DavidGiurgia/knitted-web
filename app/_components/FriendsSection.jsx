import React from "react";
import FriendsList from "./FriendsList";
import { Button } from "@nextui-org/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const FriendsSection = ({ currUser, goBack, onSelect }) => {
  return (
    <div className="p-4 w-full h-full">
      <div className="flex items-center gap-x-2 mb-4">
        <Button onPress={goBack} variant="light" isIconOnly>
          <ArrowLeftIcon className="size-5" />
        </Button>
        <h1 className="text-lg">Friends</h1>
      </div>
      <FriendsList currUser={currUser} onSelect={onSelect}/>
    </div>
  );
};

export default FriendsSection;
