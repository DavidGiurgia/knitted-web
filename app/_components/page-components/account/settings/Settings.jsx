import UserListItem from "@/app/_components/UserListItem";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Avatar, Button, Divider } from "@nextui-org/react";
import React from "react";

const Settings = ({ goBack, goTo, user }) => {
  return (
    <div className="w-full h-full flex flex-col p-4 gap-y-2">
      <div className="flex items-center gap-x-2">
        <Button onPress={goBack} variant="light" isIconOnly>
          <ArrowLeftIcon className="size-5" />
        </Button>
        <h1 className="text-lg">Settings and activity</h1>
      </div>

      <div className=" p-2">
        <label className="text-sm text-gray-500" htmlFor="accountSettings">
          Your account
        </label>
        <div
          id="accountSettings"
          className="flex items-center gap-x-4 ease-in transition-transform-colors p-4  rounded-[12px] hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" //bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
          onClick={() => goTo("AccountSettings")}
        >
          <Avatar showFallback src={user?.avatarUrl} />
          <div className="flex flex-col flex-1">
            <div className="text-sm font-medium">Account settings</div>
            <div className="text-gray-500 text-sm">
              Password, security, personal details...
            </div>
          </div>
          <ChevronRightIcon className="size-4" />
        </div>

        <Divider className="my-2" />

        <label className="text-sm text-gray-500" htmlFor="activity">
          Activity
        </label>
        <div id="activity" className="flex flex-col my-2">
          <button className="w-full px-4 py-2 rounded-[12px] flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
            Saved <ChevronRightIcon className="size-4" />
          </button>
          <button className="w-full px-4 py-2 rounded-[12px] flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
            Posts <ChevronRightIcon className="size-4" />
          </button>
          <button className="w-full px-4 py-2 rounded-[12px] flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
            Blocked <ChevronRightIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
