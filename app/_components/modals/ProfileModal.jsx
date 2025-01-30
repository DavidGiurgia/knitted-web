"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../_context/AuthContext";
import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@heroui/react";
import toast from "react-hot-toast";
import { updateUser } from "../../api/user";
import {
  uploadAvatarToImgBB,
  deleteAvatarFromImgBB,
} from "../../services/avatarService";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import InitialsAvatar from "../InitialsAvatar";

const ProfileModal = ({ isOpen, onOpenChange }) => {
  const { user, fetchProfile } = useAuth();
  const [fullname, setFullname] = useState("");
  const [fullnameError, setFullnameError] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");

  useEffect(() => {
    if (user) {
      setFullname(user.fullname || "");
      setUsername(user.username || "");
      setBio(user.bio || "");
      setSelectedAvatar(user.avatarUrl || "");
    }
  }, [user, isOpen]);

  const handleSaveProfile = async () => {
    if (!fullname) {
      setFullnameError("Name is required");
      return false;
    } else if (!username) {
      setUsernameError("Username is required");
      return false;
    }

    setLoading(true);

    try {
      let avatarUrl = selectedAvatar;
      let deleteAvatarUrl = user?.avatarDeleteUrl;

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

      // Actualizează datele utilizatorului
      await updateUser(
        user._id,
        fullname,
        username,
        bio,
        avatarUrl,
        deleteAvatarUrl
      );

      // Notificare de succes și reîmprospătarea profilului
      toast.success("Profile updated successfully");
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

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent className=" max-h-full overflow-y-auto ">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Edit Profile
            </ModalHeader>
            <ModalBody>
              {!user ? (
                <div>Please log in!</div>
              ) : (
                <>
                  <div className="flex flex-wrap items-start gap-x-4">
                    {/* Secțiunea pentru avatar */}
                    <div className="flex flex-shrink-0 w-fit items-center flex-col gap-2">
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

                      <div className="flex items-center">
                        {/* Buton pentru a schimba avatarul */}
                        <Button
                          isIconOnly
                          variant="light"
                          onPress={() =>
                            document.getElementById("fileUpload")?.click()
                          }
                        >
                          <PhotoIcon className="size-5 text-gray-500" />
                        </Button>

                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="absolute opacity-0 w-0 h-0"
                          id="fileUpload"
                        />

                        <Button
                          onPress={() => setSelectedAvatar("")}
                          isIconOnly
                          variant="light"
                        >
                          <XMarkIcon className="size-5 text-gray-500" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <div className="text-xl font-medium text-dark-bg dark:text-light-bg ">
                        {fullname || username || "Add your name"}
                      </div>
                      <div className="text-gray-500 max-w-xl text-md">
                        {bio || user?.email}
                      </div>
                    </div>
                  </div>

                  {/* Câmpuri pentru nume, username și bio */}
                  <Input
                    variant="bordered"
                    maxLength={50}
                    label="Name"
                    value={fullname}
                    isInvalid={!!fullnameError.length}
                    errorMessage={fullnameError}
                    onChange={(e) => {
                      setFullname(e.target.value);
                      setFullnameError("");
                    }}
                    onClear={() => setFullname("")}
                    isClearable
                  />
                  <Input
                    variant="bordered"
                    size="lg"
                    type="text"
                    label="Username"
                    isInvalid={!!usernameError.length}
                    errorMessage={usernameError}
                    className="w-full"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setUsernameError("");
                    }}
                    onClear={() => setUsername("")}
                    isClearable
                  />
                  <Textarea
                    variant="bordered"
                    placeholder="Add a meaningful bio..."
                    maxLength={200}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    label="Bio"
                  />
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                isLoading={loading}
                onPress={async () => {
                  const isSaved = await handleSaveProfile();
                  if (isSaved) {
                    onClose();
                  }
                }}
              >
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ProfileModal;
