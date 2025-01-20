// Utilitar pentru manipularea profilelor in localStorage
const getStoredProfile = (groupId) => {
  if (!groupId) {
    console.error("Group ID is required to retrieve a profile.");
    return null;
  }

  const storedProfile = localStorage.getItem(`temporaryProfile-${groupId}`);
  return storedProfile ? JSON.parse(storedProfile) : null;
};

const saveProfile = (groupId, profile) => {
  if (!groupId || !profile) {
    console.error("Group ID and profile are required to save a profile.");
    return;
  }

  try {
    localStorage.setItem(`temporaryProfile-${groupId}`, JSON.stringify(profile));
  } catch (error) {
    console.error("Failed to save profile to localStorage:", error);
  }
};

// Creează un profil nou pe baza utilizatorului sau a unui grup
export const createProfile = (user, groupId) => {
  if (!groupId) {
    console.error("Group ID is required to create a profile.");
    return null;
  }

  console.log("createProfile called:", user, groupId);

  const profile = user
    ? {
        id: `${user._id}-${groupId}`, // ID unic bazat pe utilizator și grup
        username: user.fullname || `User-${Math.random().toString(36).substr(2, 5)}`,
        avatarUrl: user?.avatarUrl || "",
      }
    : {
        id: `guest-${Math.random().toString(36).substr(2, 9)}-${groupId}`, // ID unic pentru guest
        username: `Guest-${Math.floor(1000 + Math.random() * 9000)}`, // Alias generat
        avatarUrl: "",
      };

  saveProfile(groupId, profile);
  return profile;
};

// Obține un profil pentru un anumit grup
export const getProfile = (user, groupId) => {
  if (!groupId) {
    console.error("Group ID is required to get a profile.");
    return null;
  }

  const profile = getStoredProfile(groupId);
  if (profile && profile.id.includes(user?._id)) {
    return profile; // Returnează profilul existent
  }

  // Creează un profil nou dacă nu există
  return createProfile(user, groupId);
};

// Actualizează un profil existent pentru un anumit grup
export const updateProfile = (profile, groupId) => {
  if (!groupId || !profile) {
    console.error("Group ID and profile are required to update a profile.");
    return;
  }

  console.log("updateProfile called with:", { groupId, profile });

  const storedProfile = getStoredProfile(groupId);
  if (!storedProfile) {
    console.error("Profile not found for the given group.");
    return;
  }

  const updatedProfile = { ...storedProfile, ...profile };
  saveProfile(groupId, updatedProfile);

  console.log("Profile updated successfully:", updatedProfile);
};
