import {
  ArrowLeftIcon,
  Bars3Icon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { Avatar, AvatarGroup, Button } from "@nextui-org/react";
import React from "react";

const ProfileSection = ({ currentUser, goBack }) => {
  return (
    <div className="p-4 flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <button
          className="flex items-center gap-x-4 text-md "
          onClick={() => goBack()}
        >
          <ArrowLeftIcon className="size-6" />{" "}
        </button>
      </div>
      <div className=" flex flex-col gap-y-4">
        <div className=" flex gap-x-4">
          <Avatar className="w-24 h-24 text-large flex-shrink-0" />
          <div>
            <div className="text-xl font-medium text-dark-bg dark:text-light-bg ">
              {currentUser?.fullname || currentUser?.username || "Unknown"}
            </div>
            <div className="text-gray-500 max-w-64 text-md">
              {currentUser?.bio || currentUser?.email}
            </div>
          </div>
        </div>

        <AvatarGroup
          //isBordered
          max={5}
          renderCount={(count) => (
            <p className="text-small text-foreground font-medium ms-2">
              +{count} others
            </p>
          )}
          total={10}
        >
          <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
          <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
          <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
          <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
          <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
          <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
        </AvatarGroup>

        <div className="flex gap-x-2 w-full">
          <Button color="primary" size="sm" className="flex-1 text-medium ">
            Add Friend
          </Button>
          <Button
            variant="faded"
            //color="danger"
            size="sm"
            className="flex-1 text-medium "
          >
            Block
          </Button>
          <Button isIconOnly variant="faded" size="sm">
            <EllipsisHorizontalIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
