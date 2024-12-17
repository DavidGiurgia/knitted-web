import React from "react";
import UserProfile from "../../UserProfile";

const ProfileSection = ({ currentUser, goBack }) => {
  return (
    <UserProfile currentUser={currentUser} goBack={goBack}/>
  );
};

export default ProfileSection;
