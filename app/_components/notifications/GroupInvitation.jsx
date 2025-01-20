"use client";
import { usePanel } from "@/app/_context/PanelContext";
import {
  getGroupByCode,
  getUserGroups,
  pairUserGroup,
} from "@/app/services/groupService";
import { getUserById } from "@/app/services/userService";
import { Avatar, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const GroupInvitation = ({ user, onClick, notification }) => {
  const [sender, setSender] = useState(null);
  const { pushSubPanel } = usePanel();
  const [group, setGroup] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSender = async () => {
      const sender = await getUserById(notification.data.senderId);
      setSender(sender);

      const groupFetched = await getGroupByCode(notification.data.joinCode);
      setGroup(groupFetched);
    };
    if (notification.data && notification.data.senderId) {
      fetchSender();
    } else {
      setSender(null);
      console.warn("unable to find sender id for notification");
    }
  }, [notification]);

  const onJoinClick = async () => {
    try {
      if (group) {
        const groups = await getUserGroups(user?._id);
        const alreadyInGroup = groups.some((g) => g._id === group._id);
        if (!alreadyInGroup) {
          await pairUserGroup(user?._id, group._id);
        }
        router.push(`/group-room/${group._id}`);
      } else {
        toast.error("Sorry, we can't find the group");
      }
    } catch (error) {
      console.error("Error joining group:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div onClick={onClick} className="flex w-full items-start gap-x-2">
      <Avatar
        showFallback
        className="flex-shrink-0 mr-2 cursor-pointer"
        src={sender?.avatarUrl}
        alt={`${sender?.username}'s avatar`}
        onClick={() => pushSubPanel("Profile", sender)}
      />
      <div className="flex-1">
        <p >
          <span
            onClick={() => pushSubPanel("Profile", sender)}
            className="cursor-pointer font-semibold"
          >
            {sender?.username}
          </span>{" "}
          has invited you to join the group
          <span className="font-semibold">
            {" "}
            {notification?.data?.groupName}
          </span>
          .
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {"No description provided."}
        </p>
      </div>
      <div className="flex-shrink-0">
        <Button
          className={`${!group && "hidden"}`}
          size="sm"
          color="primary"
          onPress={onJoinClick}
        >
          Join
        </Button>
      </div>
    </div>
  );
};

export default GroupInvitation;
