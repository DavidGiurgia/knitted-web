import React from "react";
import Avvvatars from "avvvatars-react";

// Helper function to extract initials from a nickname
const getInitials = (nickname) => {
  if (!nickname) return ""; // Handle empty or undefined nicknames

  // Split the name by spaces, take the first character of each word, and join them
  const initials = nickname
    .split(" ")
    .map((word) => word.charAt(0)) // Take the first letter of each word
    .join("")
    .toUpperCase(); // Ensure the initials are uppercase

  return initials;
};

// React component for the avatar
const InitialsAvatar = ({ nickname, size = 64 }) => {
  const initials = getInitials(nickname);

  return (
    <div
      className="flex items-center justify-center flex-shrink-0 "
    >
      <Avvvatars value={initials} size={size} />
    </div>
  );
};

export default InitialsAvatar;
