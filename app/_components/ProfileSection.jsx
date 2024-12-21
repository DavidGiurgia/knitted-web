import React from "react";
import UserProfile from "./UserProfile";

const ProfileSection = ({ currentUser }) => {
  return <UserProfile currentUser={currentUser} />;
};

export default ProfileSection;
