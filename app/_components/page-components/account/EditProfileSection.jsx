"use client";

import { usePanel } from "@/app/_context/PanelContext";
import { Avatar, Button, Input, Skeleton, Textarea } from "@heroui/react";
import React, { useEffect, useState } from "react";
import InitialsAvatar from "../../InitialsAvatar";
import {
  ArrowLeftIcon,
  CameraIcon,
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/app/_context/AuthContext";
import {
  deleteAvatarFromImgBB,
  uploadAvatarToImgBB,
} from "@/app/services/avatarService";
import { updateUser } from "@/app/api/user";
import Image from "next/image";

const EditProfileSection = () => {
  const { popSubPanel } = usePanel();
  const { user, fetchProfile } = useAuth();
  const [bio, setBio] = useState("");
  const [initialBio, setInitialBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [initialAvatar, setInitialAvatar] = useState("");
  const [selectedCover, setSelectedCover] = useState("");
  const [initialCover, setInitialCover] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

  

  useEffect(() => {
    if (user) {
      setBio(user.bio || "");
      setInitialBio(user.bio || "");
      setSelectedAvatar(user.avatarUrl || "");
      setInitialAvatar(user.avatarUrl || "");
      setSelectedCover(user.coverUrl || "");
      setInitialCover(user.coverUrl || "");
      setPreviewMode(false)
    }
  }, [user]);

  const isModified = () => {
    return (
      bio !== initialBio ||
      selectedAvatar !== initialAvatar ||
      selectedCover !== initialCover
    );
  };

  const handleSaveProfile = async () => {
    setLoading(true);

    try {
      let avatarUrl = selectedAvatar;
      let deleteAvatarUrl = user?.avatarDeleteUrl;
      let coverUrl = selectedCover;
      let deleteCoverUrl = user?.coverDeleteUrl;

      // Dacă a fost selectat un fișier nou pentru avatar
      if (typeof selectedAvatar === "object") {
        // Șterge avatarul anterior dacă există
        if (deleteAvatarUrl) {
          await deleteAvatarFromImgBB(deleteAvatarUrl);
        }

        // Încarcă noul avatar
        const response = await uploadAvatarToImgBB(selectedAvatar);
        avatarUrl = response.imageUrl;
        deleteAvatarUrl = response.deleteUrl;
      }

      // Dacă a fost selectat un fișier nou pentru copertă
      if (typeof selectedCover === "object") {
        // Șterge coperta anterioară dacă există
        if (deleteCoverUrl) {
          await deleteAvatarFromImgBB(deleteCoverUrl);
        }

        // Încarcă noua copertă
        const response = await uploadAvatarToImgBB(selectedCover);
        coverUrl = response.imageUrl;
        deleteCoverUrl = response.deleteUrl;
      }

      // Actualizează datele utilizatorului
      await updateUser(
        user._id,
        bio,
        avatarUrl,
        deleteAvatarUrl,
        coverUrl,
        deleteCoverUrl
      );

      fetchProfile(); // Reîncarcă profilul utilizatorului pentru a reflecta modificările
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
      return true;
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedAvatar(file); // Salvează fișierul selectat
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedCover(file); // Salvează fișierul selectat
    }
  };

  return (
    <div className="h-full  ">
      {previewMode ? (
        <div className="flex flex-col h-full justify-between">
          <div className="flex flex-col">
            <div className="flex p-2 items-center">
              <div className="flex items-center gap-x-2 flex-shrink-0 ">
                <Button
                  onPress={() => setPreviewMode(false)}
                  variant="light"
                  isIconOnly
                >
                  <ArrowLeftIcon className="size-5" />
                </Button>
                <div className="font-semibold text-lg">Preview profile</div>
              </div>
            </div>
            <div className="relative w-full h-40 bg-gray-100 dark:bg-gray-900 mb-4">
              {selectedCover ? (
                <Image
                  loading="lazy"
                  src={
                    selectedCover && typeof selectedCover === "object"
                      ? URL.createObjectURL(selectedCover)
                      : selectedCover || ""
                  }
                  alt="Cover"
                  layout="fill"
                  objectFit="cover"
                  quality={75}
                />
              ) : (
                <Skeleton disableAnimation className="w-full h-full" />
              )}

              {/* Avatar */}
              <div className="absolute overflow-visibile flex items-center justify-center flex-shrink-0  left-24 bottom-[-20%] transform -translate-x-1/2 bg-white dark:bg-gray-950 rounded-full  w-[106px] h-[106px]">
                {selectedAvatar ? (
                  <Avatar
                    showFallback
                    className="w-24 h-24 object-cover"
                    src={
                      selectedAvatar && typeof selectedAvatar === "object"
                        ? URL.createObjectURL(selectedAvatar)
                        : selectedAvatar || ""
                    }
                  />
                ) : (
                  <InitialsAvatar nickname={user?.fullname} size={96} />
                )}
              </div>
            </div>

            <div className="px-4 py-2 flex flex-col gap-y-2 mt-4">
              <div className="w-full flex flex-col text-start">
                <div className="text-xl font-medium text-dark-bg dark:text-light-bg ">
                  {user?.fullname || "Unknown"}
                </div>
                <div className="text-gray-500 line-clamp-3 text-md">
                  {bio || user?.email}
                </div>
              </div>
            </div>
          </div>

          <Button
            className="m-2"
            color="primary"
            isLoading={loading}
            onPress={async () => {
              const isSaved = await handleSaveProfile();
              if (isSaved) {
                popSubPanel();
              }
            }}
          >
            Update
          </Button>
        </div>
      ) : (
        <div className=" ">
          {/* Header */}
          <div className="flex p-2 items-center justify-between border-b border-gray-300 dark:border-gray-700">
            <div className="flex items-center gap-x-2 flex-shrink-0 ">
              <Button onPress={popSubPanel} variant="light" isIconOnly>
                <ArrowLeftIcon className="size-5" />
              </Button>
              <div className="font-semibold text-lg">Edit profile</div>
            </div>
            <div className="flex items-center gap-x-2">
              {isModified() && (
                <Button
                  variant="bordered"
                  size="sm"
                  onPress={() => setPreviewMode(true)}
                >
                  Preview
                </Button>
              )}
              <Button
                isDisabled={!isModified()}
                size="sm"
                color="primary"
                isLoading={loading}
                onPress={async () => {
                  const isSaved = await handleSaveProfile();
                  if (isSaved) {
                    popSubPanel();
                  }
                }}
              >
                Update
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-y-2 p-2 ">
            <div className="flex flex-col gap-y-2 ">
              <div className="flex items-center justify-between w-full">
                <h1 className="font-semibold">Profile picture</h1>
                <div className="flex items-center">
                  {/* Buton pentru a schimba avatarul */}
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={() =>
                      document.getElementById("avatarUpload")?.click()
                    }
                  >
                    <CameraIcon className="size-5 text-gray-500" />
                  </Button>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="absolute opacity-0 w-0 h-0"
                    id="avatarUpload"
                  />

                  {selectedAvatar && (
                    <Button
                      onPress={() => setSelectedAvatar("")}
                      isIconOnly
                      variant="light"
                    >
                      <XMarkIcon className="size-5 text-gray-500" />
                    </Button>
                  )}
                </div>
              </div>
              {/* Secțiunea pentru avatar */}
              <div className="w-full flex flex-shrink-0 items-center flex-col gap-2">
                {selectedAvatar ? (
                  <Avatar
                    showFallback
                    className="w-24 h-24"
                    src={
                      selectedAvatar && typeof selectedAvatar === "object"
                        ? URL.createObjectURL(selectedAvatar)
                        : selectedAvatar || ""
                    }
                  />
                ) : (
                  <InitialsAvatar nickname={user?.fullname} size={96} />
                )}
              </div>
            </div>

            <hr className="my-4  border-gray-200 dark:border-gray-800" />

            <div className="flex flex-col gap-y-2 ">
              <div className="flex items-center justify-between w-full">
                <h1 className="font-semibold">Cover photo</h1>
                <div className="flex items-center">
                  {/* Buton pentru a schimba cover photo */}
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={() =>
                      document.getElementById("coverUpload")?.click()
                    }
                  >
                    <CameraIcon className="size-5 text-gray-500" />
                  </Button>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="absolute opacity-0 w-0 h-0"
                    id="coverUpload"
                  />

                  {selectedCover && (
                    <Button
                      onPress={() => setSelectedCover("")}
                      isIconOnly
                      variant="light"
                    >
                      <XMarkIcon className="size-5 text-gray-500" />
                    </Button>
                  )}
                </div>
              </div>
              {/* Secțiunea pentru cover photo */}
              <div className="w-full h-32 relative">
                {selectedCover ? (
                  <Image
                    loading="lazy"
                    src={
                      selectedCover && typeof selectedCover === "object"
                        ? URL.createObjectURL(selectedCover)
                        : selectedCover || ""
                    }
                    alt="Cover"
                    layout="fill"
                    objectFit="cover"
                    quality={75}
                    className="rounded-lg"
                  />
                ) : (
                  <Skeleton
                    disableAnimation
                    className="w-full h-full rounded-lg"
                  />
                )}
              </div>
            </div>

            <hr className="my-4 border-gray-200 dark:border-gray-800" />

            {/* Câmpuri pentru bio */}

            <div className="flex flex-col gap-y-2 ">
              <div className="flex items-center justify-between w-full">
                <h1 className="font-semibold">Bio</h1>
              </div>
            </div>

            <Textarea
              variant="bordered"
              placeholder="Add a short bio to tell people more about yourself."
              maxLength={101}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              //label="Bio"
              description="Your bio is public and limited to 101 characters."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfileSection;
