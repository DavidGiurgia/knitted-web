"use client";

import { useAuth } from "@/app/_context/AuthContext";
import {
  getGroupByCode,
  getUserGroups,
  pairUserGroup,
} from "@/app/services/groupService";
import {  HashtagIcon } from "@heroicons/react/16/solid";
import {
  EllipsisVerticalIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
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
import GroupModal from "../../GroupModal";

const GroupsSection = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
  }, [user?._id]);

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

  const handleDeleteGroup = () => {
    if(selectedGroup){

    }
  }

  return (
    <div className="flex flex-1 flex-col h-full md:w-[350px] lg:w-[450px] dark:text-white bg-white dark:bg-gray-900">
      {/* Join Group Input */}
      <div className="flex flex-col gap-y-4 justify-center items-center py-6 px-4 bg-primary">
        <form className="flex items-center p-2 bg-gray-100 dark:bg-gray-900 rounded-xl drop-shadow-md w-full max-w-xs">
          <HashtagIcon className="w-10 h-10 text-light-secondary dark:text-gray-200 ml-2" />
          <input
            className="ml-2 w-full text-xl outline-none bg-gray-100 dark:bg-gray-900 text-dark-secondary dark:text-gray-100"
            placeholder="Enter code here"
            value={code}
            onChange={(e) => setCode(e.target.value)} // Setează codul
            required
          />
          <Button
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
          <div onClick={() => {}}>
            <Button
              isIconOnly
              className="p-0"
              startContent={<PlusIcon className="w-6 h-6 " />}
              //color="primary"
              onClick={() => {
                onOpen();
                setSelectedGroup(null);
              }}
              variant="light"
            />
          </div>
        </div>
      </div>

      {/* Groups List */}
      {groups.length > 0 ? (
        <Listbox className="space-y-2 w-full  px-4 py-2 h-full flex flex-col">
          {groups.map((group) => (
            <ListboxItem
              variant="light"
              key={group._id}
              className="flex items-center rounded-lg bg-transparent "
              aria-label="Item"
            >
              <ButtonGroup variant="flat" className="w-full">
                <Button
                  variant="light"
                  className="text-lg text-start flex items-center justify-start flex-1 font-semibold text-primary truncate"
                  onClick={() => router.push(`/group-room/${group._id}`)}
                >
                  <HashtagIcon className="w-6 h-6 text-primary mr-2" />
                  {group.name}
                </Button>
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly variant="light">
                      <EllipsisVerticalIcon className="w-6 h-6 text-gray-500" />
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
                      variant="flat"
                      key="leave"
                      color="danger"
                    >
                      Leave Group
                    </DropdownItem>
                    <DropdownItem
                    className={`${group.creatorId !== user._id && "hidden"}`}
                      description="This action is irreversibile"
                      variant="flat"
                      key="delete"
                      color="danger"
                      onClick={() => {openDeleteModal(); setSelectedGroup(group)}}
                    >
                      Delete Group
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </ButtonGroup>
            </ListboxItem>
          ))}
        </Listbox>
      ) : (
        <div className="flex justify-center items-center h-full text-gray-500">
          You are not part of any group yet.{" "}
          <button
            onClick={() => {
              onOpen();
              setSelectedGroup(null);
            }}
            className="text-primary"
          >
            Create
          </button>{" "}
          or join one!
        </div>
      )}

      <GroupModal
        group={selectedGroup}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};

export default GroupsSection;
