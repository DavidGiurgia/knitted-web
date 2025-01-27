import { updateParticipant } from "../api/group";
import { getProfileByUserGroup, updateProfileByUserGroup } from "../api/user-group";

const generateUniqueId = () => `guest-${Math.random().toString(36).substr(2, 9)}`;

const generateRandomNickname = () => `Guest-${Math.floor(Math.random() * 1000)}`;

const getGuestParticipant = () => {
  let guestParticipant = JSON.parse(sessionStorage.getItem("guestParticipant") || "null");

  if (!guestParticipant) {
    guestParticipant = {
      id: generateUniqueId(),
      nickname: generateRandomNickname(),
    };
    sessionStorage.setItem("guestParticipant", JSON.stringify(guestParticipant));
  }

  return guestParticipant;
};

export const getCurrentParticipant = async (user, groupId) => {
  if (user) {
    if (!groupId) {
      throw new Error("Group ID is required to fetch nickname for registered users.");
    }

    try {
      const result = await getProfileByUserGroup(user?._id, groupId);
      return result.profile;
    } catch (error) {
      console.error("Error fetching nickname:", error);
    }
  } else {
    return getGuestParticipant();
  }
};

export const updateParticipantProfile = async ( userId = null, groupId = null, participant) => {
  if (userId) {
    if (!groupId) {
      throw new Error("Group ID is required to update nickname for registered users.");
    }

    try {
      await updateProfileByUserGroup(userId, groupId, participant);
    } catch (error) {
      console.error("Error updating nickname:", error);
    }
  } else {
    sessionStorage.setItem("guestParticipant", JSON.stringify(participant));
  }

  await updateParticipant(groupId, participant);
};
