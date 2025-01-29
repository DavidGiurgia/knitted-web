import { Avatar, Button } from "@heroui/react";
import React from "react";
import InitialsAvatar from "../InitialsAvatar";

const FriendRequest = ({ user, sender, onAction, onClick }) => {
  return (
    <div onClick={onClick} className="flex w-full items-start gap-x-2">
      <div className="mr-2">
      {sender?.avatarUrl ? (
        <Avatar
          showFallback
          className="flex-shrink-0 "
          src={sender?.avatarUrl}
        />
      ) : (
        <InitialsAvatar nickname={sender?.fullname} size={40} />
      )}
      </div>
      <p className="flex-1">
        <span className="font-semibold">{sender?.username + " "}</span>
        sent you a friend request.
      </p>
      {!user?.blockedUsers.includes(sender?._id) ? (
        user?.friendRequests.includes(sender?._id) && (
          <Button className="px-4" size="sm" color="primary" onPress={onAction}>
            Accept
          </Button>
        )
      ) : (
        <i className="text-gray-500 text-sm">Blocked</i>
      )}
    </div>
  );
};

export default FriendRequest;
