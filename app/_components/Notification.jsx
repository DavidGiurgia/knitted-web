// components/Notification.js

import { multiFormatDateString } from "../services/utils";
import { Avatar, Button } from "@nextui-org/react";

const Notification = ({ user, notification, onClick,  onConfirm }) => {
  return (
    <div onClick={onClick} className="flex p-4 mb-2 flex-col w-full items-end gap-y-2 rounded-lg bg-white dark:bg-gray-900 shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
      <div className="flex w-full items-start gap-x-2">
        <Avatar
          showFallback
          className="flex-shrink-0 mr-2"
          src={notification.sender?.avatarUrl}
        />
        <p className="flex-1">
          <span className="font-semibold">{notification.sender?.username + " "}</span>
          {`${
            notification.type === "friend_request"
              ? "sent you a friend request."
              : "accepted your friend request."
          }`}
        </p>
        {notification.sender?.sentRequests.includes(user._id) && (
          <Button
            className="px-4"
            size="sm"
            color="primary"
            onPress={onConfirm}
          >
            Accept
          </Button>
        )}
      </div>
      <div className="text-xs text-gray-400">
        {multiFormatDateString(notification.createdAt)}
      </div>
    </div>
  );
};

export default Notification;
