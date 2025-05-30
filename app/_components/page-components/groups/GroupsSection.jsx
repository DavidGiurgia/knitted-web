"use client";

import { useAuth } from "@/app/_context/AuthContext";
import {
  deleteGroup,
  getGroupByCode,
  getUserGroups,
  pairUserGroup,
} from "@/app/services/groupService";
import { HashtagIcon } from "@heroicons/react/16/solid";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Button, useDisclosure, Tooltip } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CustomModal from "../../modals/CustomModal";
import { removePair } from "@/app/api/user-group";
import { format } from "date-fns";
import CreateGroupModal from "../../modals/CreateGroupModal";
import UpdateGroupModal from "../../modals/UpdateGroupModal";
import { usePanel } from "@/app/_context/PanelContext";

const GroupsSection = () => {
  const { user } = useAuth();
  const { screenSize, pushSubPanel } = usePanel();
  const router = useRouter();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [value, setValue] = useState("");
  const [showJoinSection, setShowJoinSection] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const {
    isOpen: isCreateGroupModalOpen,
    onOpen: onCreateGroupModaOpen,
    onOpenChange: onCreateGroupModaOpenChange,
  } = useDisclosure();
  const {
    isOpen: isDeleteGroupModalOpen,
    onOpen: onDeleteGroupModaOpen,
    onOpenChange: onDeleteGroupModaOpenChange,
  } = useDisclosure();
  const {
    isOpen: isUpdateGroupModalOpen,
    onOpen: onUpdateGroupModaOpen,
    onOpenChange: onUpdateGroupModaOpenChange,
  } = useDisclosure();

  const [code, setCode] = useState("");

  const formattedGroupLifetime = (currentGroup) => {
    if (!currentGroup?.createdAt || !currentGroup?.expiresAt) {
      return "Unknown range date";
    }

    const createdAt = new Date(currentGroup.createdAt);
    const expiresAt = new Date(currentGroup.expiresAt);

    // Check if both dates are in the same month and year
    if (format(createdAt, "MMM yyyy") === format(expiresAt, "MMM yyyy")) {
      return `${format(createdAt, "MMM d")} - ${format(expiresAt, "d, yyyy")}`;
    }

    // If they are not in the same month/year
    return `${format(createdAt, "MMM d")} - ${format(expiresAt, "d, yyyy")}`;
  };

  const handleCopyJoinCode = () => {
    if (!navigator.clipboard) {
      toast.error("Clipboard API not supported.");
      return;
    }

    if (currentGroup?.joinCode) {
      navigator.clipboard
        .writeText(currentGroup.joinCode)
        .then(() => {
          toast.success("Join code copied to clipboard!");
        })
        .catch(() => {
          toast.error("Failed to copy join code.");
        });
    } else {
      toast.error("No join code available to copy.");
    }
  };

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
  }, [user?._id, isCreateGroupModalOpen, isDeleteGroupModalOpen]);

  const handleJoin = async () => {
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
          const userAsParticipnat = {
            id: user._id,
            nickname: user.fullname,
          };
          await pairUserGroup(user?._id, group._id, userAsParticipnat);
          setGroups((prevGroups) => [...prevGroups, group]);
        }
        router.push(`/group-room/${group._id}`);
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
      await removePair(user._id, group._id);
      setGroups((prevGroups) => prevGroups.filter((g) => g._id !== group._id));
      toast.success(`You left the group \"${group.name}\" successfully!`);
    } catch (error) {
      console.error("Error leaving group:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  // Filter groups based on the search value
  const filteredGroups = groups?.filter((group) =>
    group?.name?.toLowerCase().includes(value.toLowerCase())
  );

  const isCreator = (group) => {
    return user?._id === group?.creatorId;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < lastScrollY) {
        // Dacă utilizatorul face scroll în sus, afișăm secțiunea
        setShowJoinSection(true);
      } else {
        // Dacă utilizatorul face scroll în jos, ascundem secțiunea
        setShowJoinSection(false);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="flex flex-1 flex-col h-full md:w-[350px] lg:w-[450px] dark:text-white ">
      {/* Join Group Input */}
      <div className="flex flex-col gap-y-4 justify-center items-center py-6 px-4 bg-primary">
        <div
          aria-label="Join group form"
          className="flex items-center p-2 bg-white dark:bg-gray-900 rounded-xl drop-shadow-md w-full max-w-xs"
        >
          <HashtagIcon
            aria-hidden="true"
            className="w-10 h-10 text-light-secondary dark:text-gray-200 ml-2"
          />
          <input
            aria-label="Group join code"
            className="ml-2 w-full text-xl outline-none  text-dark-secondary dark:text-gray-100 dark:bg-gray-900"
            placeholder="Enter code here"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button
            aria-label="Join group"
            onPress={handleJoin}
            className=" bg-primary rounded-lg text-xl font-semibold ml-2 text-white dark:text-black"
          >
            Join
          </Button>
        </div>
      </div>

      {/* Group List Section */}
      <div className="py-4 px-6 dark:bg-gray-950">
        <div className="flex justify-between items-center">
          <h1 className="text-xl ">ZIC Groups</h1>

          <Button
            onPress={() => {
              setSelectedGroup(null);
              if (screenSize < 640) {
                pushSubPanel("CreateGroup");
              } else {
                onCreateGroupModaOpen();
              }
            }}
            isIconOnly
            className="p-0"
            startContent={<PlusIcon className="w-6 h-6 " />}
            variant="light"
          />
        </div>
      </div>

      {groups.length > 1 ? (
        <div className="flex mx-2 md:mx-4 items-center p-2 border border-gray-200 dark:border-gray-800 rounded-lg">
          <MagnifyingGlassIcon className="text-gray-500 size-4 mr-2 flex-shrink-0" />
          <input
            onChange={(event) => setValue(event.currentTarget.value)}
            value={value}
            placeholder="Search by name"
            className="flex-1 outline-none bg-transparent"
          />
        </div>
      ) : null}

      {/* Groups Grid */}
      {filteredGroups.length > 0 ? (
        <div className={`flex flex-col gap-y-4 p-2 md:px-4 overflow-y-auto`}>
          {filteredGroups.map((group) => (
            <div
              key={group._id}
              className="flex flex-col  border-gray-800 rounded-[12px] shadow dark:shadow-black p-2"
            >
              <div className="h-full flex flex-col gap-y-2">
                <Button
                  aria-label={`Open group ${group.name}`}
                  variant="light"
                  className="w-full h-full flex flex-col p-2 justify-start"
                  onPress={() => router.push(`/group-room/${group._id}`)}
                >
                  <div className="text-wrap text-start w-full">
                    <div className="text-lg text-primary">{group.name}</div>
                  </div>
                  <div className="flex text-start w-full gap-x-2">
                    <p className="text-sm flex-1 text-gray-500 text-wrap line-clamp-3">
                      {group.description || (
                        <i className={`${!isCreator(group) ? "hidden" : ""}`}>
                          Add a description
                        </i>
                      )}
                    </p>
                  </div>
                </Button>

                <div className="flex items-center gap-x-1">
                  <div className="flex-1 p-2 text-gray-700 dark:text-gray-300 text-sm ">
                    {formattedGroupLifetime(group)}
                  </div>
                  <Tooltip content="Copy" placement="top" showArrow>
                    <Button
                      onPress={handleCopyJoinCode}
                      variant="light"
                      className=" text-sm flex  justify-start text-gray-700 dark:text-gray-300"
                    >
                      {`# ${group.joinCode}`}
                    </Button>
                  </Tooltip>

                  {group.creatorId === user?._id ? (
                    <Tooltip content="Edit" placement="top" showArrow>
                      <Button
                        aria-label={`Options for group ${group.name}`}
                        isIconOnly
                        variant="light"
                        onPress={() => {
                          setSelectedGroup(group);
                          onUpdateGroupModaOpen();
                        }}
                      >
                        <PencilIcon
                          aria-hidden="true"
                          className="w-6 h-6 p-1 text-gray-700 dark:text-gray-300"
                        />
                      </Button>
                    </Tooltip>
                  ) : null}
                  <Tooltip
                    content={isCreator(group) ? "Delete" : "Remove"}
                    placement="top"
                    showArrow
                  >
                    <Button
                      aria-label={`Delete group ${group.name}`}
                      isIconOnly
                      color="danger"
                      variant="light"
                      onPress={() => {
                        setSelectedGroup(group);
                        {
                          group.creatorId === user?._id
                            ? onDeleteGroupModaOpen()
                            : handleRemoveGroup(group);
                        }
                      }}
                    >
                      <TrashIcon
                        aria-hidden="true"
                        className="w-6 h-6 p-1 text-gray-700 dark:text-gray-300"
                      />
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-full w-full">
          <div className="text-center max-w-sm">
            {value ? (
              "No groups found matching your search."
            ) : (
              <div>
                You are not part of any group yet.
                <br />
                <button
                  onClick={() => {
                    setSelectedGroup(null);
                    if (screenSize < 640) {
                      pushSubPanel("CreateGroup");
                    } else {
                      onCreateGroupModaOpen();
                    }
                  }}
                  className="text-primary hover:underline"
                >
                  Create
                </button>{" "}
                or join one!
              </div>
            )}
          </div>
        </div>
      )}

      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onOpenChange={onCreateGroupModaOpenChange}
      />
      <UpdateGroupModal
        isOpen={isUpdateGroupModalOpen}
        onOpenChange={onUpdateGroupModaOpenChange}
        group={selectedGroup}
      />
      <CustomModal
        isOpen={isDeleteGroupModalOpen}
        onOpenChange={onDeleteGroupModaOpenChange}
        title="Delete Group"
        body={`Are you sure you want to delete group \"${selectedGroup?.name}\"? This action cannot be undone.`}
        confirmButtonText="Delete"
        confirmButtonColor="danger"
        cancelButtonText="Cancel"
        onConfirm={async () => {
          await deleteGroup(selectedGroup?._id);
          setSelectedGroup(null);
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
