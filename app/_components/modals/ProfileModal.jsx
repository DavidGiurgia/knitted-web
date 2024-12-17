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
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { updateUser } from "../../api/user";
import { uploadAvatarToImgBB, deleteAvatarFromImgBB } from "../../services/avatarService";

const ProfileModal = ({ isOpen, onOpenChange }) => {
  const { user, fetchProfile } = useAuth();
  const [fullname, setFullname] = useState("");
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
    if (!username) {
      setUsernameError("Username is required");
      return;
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
      await updateUser(user._id, fullname, username, bio, avatarUrl, deleteAvatarUrl);

      // Notificare de succes și reîmprospătarea profilului
      toast.success("Profile updated successfully");
      fetchProfile(); // Reîncarcă profilul utilizatorului pentru a reflecta modificările
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
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
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Edit Profile</ModalHeader>
            <ModalBody>
              {!user ? (
                <div>Please log in!</div>
              ) : (
                <>
                  {/* Secțiunea pentru avatar */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center">
                      <Avatar
                      showFallback
                        className="w-28 h-28"
                        src={
                          selectedAvatar && typeof selectedAvatar === "object"
                            ? URL.createObjectURL(selectedAvatar)
                            : selectedAvatar || ""
                        }
                      />
                    </div>

                    {/* Buton pentru a schimba avatarul */}
                    <Button htmlFor="fileUpload" variant="light">
                      <label htmlFor="fileUpload">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                          id="fileUpload"
                        />
                        Change picture
                      </label>
                    </Button>
                  </div>

                  {/* Câmpuri pentru nume, username și bio */}
                  <Input
                    maxLength={50}
                    label="Name"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                  />
                  <Input
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
                  />
                  <Textarea
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
              <Button
                variant="light"
                onPress={onClose}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                isLoading={loading}
                onPress={() => {
                  handleSaveProfile();
                  onClose();
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
