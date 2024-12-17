// components/Notification.js

import React from "react";
import { multiFormatDateString } from "../services/utils";

const Notification = ({notification  }) => {
  return (
    <div className="w-full ">
      <div >{notification.message}</div>
      <div className="text-xs text-gray-400">{multiFormatDateString(notification.timestamp)}</div>
    </div>
  );
};

export default Notification;
