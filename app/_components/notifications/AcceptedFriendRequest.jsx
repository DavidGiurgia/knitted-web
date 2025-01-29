import { Avatar, Button } from "@heroui/react";
import React from "react";
import InitialsAvatar from "../InitialsAvatar";

const AcceptedFriendRequest = ({ user, acceptedBy, onAction, onClick }) => {
  return (
    <div onClick={onClick} className="flex w-full items-start gap-x-2">
      <div className="mr-2">
        {acceptedBy?.avatarUrl ? (
          <Avatar
            showFallback
            className="flex-shrink-0"
            src={acceptedBy?.avatarUrl}
          />
        ) : (
          <InitialsAvatar nickname={acceptedBy?.fullname} size={40} />
        )}
      </div>
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
