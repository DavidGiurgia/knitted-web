import DeleteAccountModal from "@/app/_components/modals/DeleteAccountModal";
import { ArrowLeftIcon, IdentificationIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { Button, Divider, useDisclosure } from "@heroui/react";
import React from "react";

const AccountSettings = ({ goBack, user }) => {
  const {isOpen: isOpenDeleteAccount, onOpen: onOpenDeleteAccount, onOpenChange:onOpenChangeDeleteAccount} = useDisclosure();
  return (
    <div className="w-full h-full flex flex-col p-4 gap-y-2">
      <div className="flex items-center gap-x-2">
        <Button onPress={goBack} variant="light" isIconOnly>
          <ArrowLeftIcon className="size-5" />
        </Button>
        <h1 className="text-lg">Account settings</h1>
      </div>

      <label className="text-sm text-gray-500 mt-4" htmlFor="activity">
        Security 
      </label>
      <div id="activity" className="flex flex-col my-2">
        <button className="w-full px-4 py-2 rounded-[12px] gap-x-2 flex items-center hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
          <IdentificationIcon className="size-5"/>  Personal details
        </button>
        <button className="w-full px-4 py-2 rounded-[12px] flex gap-x-2 items-center hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
        <LockClosedIcon className="size-5"/>  Change password
        </button>
        <Divider className="my-2"/>
        <label className="text-sm text-gray-500 mt-4" htmlFor="dangerZone">
        Danger zone
      </label>
        <button id="dangerZone" onClick={onOpenDeleteAccount} className="text-red-500 dark:text-red-700 w-full px-4 py-2 rounded-[12px] flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
          Delete account
        </button>
      </div>

    <DeleteAccountModal isOpen={isOpenDeleteAccount} onOpenChange={onOpenChangeDeleteAccount} user={user}/>

    </div>
  );
};

export default AccountSettings;
