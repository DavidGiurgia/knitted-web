import { Avatar, Button } from "@nextui-org/react";
import React from "react";

const AcceptedFriendRequest = ({user, acceptedBy, onAction, onClick }) => {
  return (
    <div onClick={onClick} className="flex w-full items-start gap-x-2">
      <Avatar
        showFallback
        className="flex-shrink-0 mr-2"
        src={acceptedBy?.avatarUrl}
      />
      <p className="flex-1">
        <span className="font-semibold">{acceptedBy?.username + " "}</span>
        accepted your friend request.
      </p>

      {user?.friendsIds.includes(acceptedBy?._id) && (
        <Button
          className="px-4"
          size="sm"
          variant="bordered"
          onPress={onAction}
        >
          Message
        </Button>
      )}
    </div>
  );
};

export default AcceptedFriendRequest;
