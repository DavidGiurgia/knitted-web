"use client";

import { useAuth } from "@/app/_context/AuthContext";
import {
  deleteGroup,
  getGroupByCode,
  getUserGroups,
  pairUserGroup,
} from "@/app/services/groupService";
import { HashtagIcon } from "@heroicons/react/16/solid";
import { EllipsisHorizontalIcon, PlusIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Listbox,
  ListboxItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
  ButtonGroup,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import GroupModal from "../../modals/GroupModal";
import CustomModal from "../../modals/CustomModal";
import { removePair } from "@/app/api/user-group";

const GroupsSection = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModaOpen,
    onOpenChange: onDeleteModaOpenChange,
  } = useDisclosure();

  const [code, setCode] = useState("");

  // Fetch user groups on mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const userGroups = await getUserGroups(user._id);
        setGroups(userGroups);
      } catch (error) {
        console.error("Error fetching user groups:", error);
      }
    };

    if (user?._id) {
      fetchGroups();
    }
  }, [user?._id, isOpen, isDeleteModalOpen]);

  const handleJoin = async (e) => {
    e.preventDefault();

    if (code.length !== 7) {
      toast.error("Please enter a valid join code", {
        position: "bottom-center",
      });
      return;
    }

    try {
      const group = await getGroupByCode(code);
      if (group) {
        const alreadyInGroup = groups.some((g) => g._id === group._id);
        if (!alreadyInGroup) {
          await pairUserGroup(user?._id, group._id);
          setGroups((prevGroups) => [...prevGroups, group]);
        }
        router.push(`/groupRoom/${group._id}`);
      } else {
        toast.error("Sorry, there is no such group active right now");
      }
    } catch (error) {
      console.error("Error joining group:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleRemoveGroup = async (group) => {
    try {
      // Elimină asocierea utilizatorului cu grupul
      await removePair(user._id, group._id);

      // Actualizează lista de grupuri locale
      setGroups((prevGroups) => prevGroups.filter((g) => g._id !== group._id));

      toast.success(`You left the group "${group.name}" successfully!`);
    } catch (error) {
      console.error("Error leaving group:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-1 flex-col h-full md:w-[350px] lg:w-[450px] dark:text-white bg-white dark:bg-gray-900">
      {/* Join Group Input */}
      <div className="flex flex-col gap-y-4 justify-center items-center py-6 px-4 bg-primary">
        <form
          aria-label="Join group form"
          className="flex items-center p-2 bg-gray-100 dark:bg-gray-900 rounded-xl drop-shadow-md w-full max-w-xs"
        >
          <HashtagIcon
            aria-hidden="true"
            className="w-10 h-10 text-light-secondary dark:text-gray-200 ml-2"
          />
          <input
            aria-label="Group join code"
            className="ml-2 w-full text-xl outline-none bg-gray-100 dark:bg-gray-900 text-dark-secondary dark:text-gray-100"
            placeholder="Enter code here"
            value={code}
            onChange={(e) => setCode(e.target.value)} // Setează codul
            required
          />
          <Button
            aria-label="Join group"
            type="submit"
            onClick={(e) => handleJoin(e)} // Apelează funcția handleJoin când se apasă butonul
            className=" bg-primary rounded-lg text-xl font-semibold ml-2 text-white dark:text-black"
          >
            Join
          </Button>
        </form>
      </div>

      {/* Group List Section */}
      <div className="p-6 dark:bg-gray-900">
        <div className="flex justify-between items-center">
          <h1 className="text-xl ">ZIC Groups</h1>

          <Button
            onPress={() => {
              setSelectedGroup(null);
              onOpen();
            }}
            isIconOnly
            className="p-0"
            startContent={<PlusIcon className="w-6 h-6 " />}
            variant="light"
          />
        </div>
      </div>

      {/* Groups List */}
      {groups.length > 0 ? (
        <Listbox className="space-y-2 w-full  px-4 py-2 h-full flex flex-col overflow-y-auto">
          {groups.map((group) => (
            <ListboxItem
              variant="light"
              key={group._id}
              className="flex items-center rounded-lg bg-transparent "
              aria-label={`Group ${group.name}`}
            >
              <ButtonGroup
                variant="flat"
                className="w-full rounded-[12px] shadow dark:shadow-gray-950 h-full"
              >
                <Button
                  aria-label={`Open group ${group.name}`}
                  variant="light"
                  className=" h-12 text-lg text-start flex items-center justify-start flex-1 font-semibold text-primary truncate"
                  onClick={() => router.push(`/group-room/${group._id}`)}
                >
                  <HashtagIcon className="w-6 h-6 text-primary mr-2" />
                  {group.name}
                </Button>
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      aria-label={`Options for group ${group.name}`}
                      className="h-12 border-gray-300 dark:border-gray-800"
                      isIconOnly
                      variant="light"
                    >
                      <EllipsisHorizontalIcon
                        aria-hidden="true"
                        className="w-6 h-6 text-gray-500"
                      />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Group Options"
                    disallowEmptySelection
                    className="max-w-[300px]"
                    selectionMode="single"
                  >
                    <DropdownItem
                      key="view"
                      onPress={() => {
                        onOpen();
                        setSelectedGroup(group);
                      }}
                    >
                      View Details
                    </DropdownItem>
                    <DropdownItem
                      onClick={async () => await handleRemoveGroup(group)}
                      variant="flat"
                      key="leave"
                      color="danger"
                      className={`${group.creatorId === user?._id && "hidden"}`}
                    >
                      Remove
                    </DropdownItem>
                    <DropdownItem
                      className={`${group.creatorId !== user?._id && "hidden"}`}
                      description="This action cannot be undone!"
                      variant="flat"
                      key="delete"
                      color="danger"
                      onClick={() => {
                        setSelectedGroup(group);
                        if (selectedGroup?._id) {
                          onDeleteModaOpen();
                        }
                      }}
                    >
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </ButtonGroup>
            </ListboxItem>
          ))}
        </Listbox>
      ) : (
        <div className="flex justify-center items-center h-full w-full">
          <div className="text-center max-w-sm">
            You are not part of any group yet.
            <br />
            <button
              onClick={() => {
                setSelectedGroup(null);
                onOpen();
              }}
              className="text-primary hover:underline"
            >
              Create
            </button>{" "}
            or join one!
          </div>
        </div>
      )}

      <GroupModal
        group={selectedGroup}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
      <CustomModal
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModaOpenChange}
        title="Delete Group"
        body={`Are you sure you want to delete group "${selectedGroup?.name}"? This action cannot be undone.`}
        confirmButtonText="Delete"
        confirmButtonColor="danger"
        cancelButtonText="Cancel"
        onConfirm={async () => {
          // Perform deletion logic here
          await deleteGroup(selectedGroup?._id);
          setSelectedGroup(null);
          // Actualizează lista de grupuri locale
          setGroups((prevGroups) =>
            prevGroups.filter((g) => g._id !== selectedGroup._id)
          );
          toast.success("Group deleted successfully");
        }}
      />
    </div>
  );
};

export default GroupsSection;
