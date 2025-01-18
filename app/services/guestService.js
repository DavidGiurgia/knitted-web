export const createProfile = (user) => {
  if (user) {
    return {
      id: user._id,
      username: user.fullname
    };
  } else {
    const guestId = `guest-${Math.random().toString(36).substr(2, 9)}`;  // Generare ID unic pentru guest
    const username = `Guest-${Math.floor(1000 + Math.random() * 9000)}`;  // Generare alias pentru guest
    const profile = { id: guestId, username };

    localStorage.setItem("guestProfile", JSON.stringify(profile));  // Salvare profile in localStorage
    return profile;
  }
};

export const getProfile = (user) => {
  const profile = localStorage.getItem("guestProfile");
  if (profile) {
    return JSON.parse(profile);  // Returneaza profilul stocat sau null
  } else {
    return createProfile(user);  // Creeaza un nou profil pentru guest
  }
};

export const updateGuestAlias = (newAlias) => {
  const guestProfile = getProfile();
  if (guestProfile) {
    guestProfile.username = newAlias;
    localStorage.setItem("guestProfile", JSON.stringify(guestProfile));  // Actualizeaza alias-ul in localStorage
  }
};
