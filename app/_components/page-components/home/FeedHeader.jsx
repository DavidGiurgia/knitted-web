import { BellIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import React from "react";

const FeedHeader = ({switchPanel}) => {

  return (
    <div className="dark:bg-gray-950 w-full flex items-center justify-between px-4 py-2 md:hidden border-b border-gray-300 dark:border-gray-800">
      <Dropdown>
        <DropdownTrigger> All </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Friends</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Button
        variant="light"
        isIconOnly
        onPress={() => {
          switchPanel("Notifications");
        }}
        className=" rounded-lg "
      >
        <BellIcon className="size-6" />
      </Button>
    </div>
  );
};

export default FeedHeader;
