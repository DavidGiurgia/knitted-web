import React from "react";
import FriendsList from "./FriendsList";
import { Button } from "@heroui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const FriendsSection = ({ currUser, goBack, onSelect, mutualOnly = false }) => {
  return (
    <div className="p-4 w-full h-full gap-y-2">
      <div className="flex items-center gap-x-2 mb-2">
        <Button onPress={goBack} variant="light" isIconOnly>
          <ArrowLeftIcon className="size-5" />
        </Button>
        <h1 className="text-lg">{currUser?.fullname}</h1>
      </div>
      <FriendsList currUser={currUser} onSelect={onSelect} mutualOnly={mutualOnly}/>
    </div>
  );
};

export default FriendsSection;
