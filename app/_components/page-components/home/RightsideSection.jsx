import React from "react";
import SuggestedForYou from "../../friends-items/SuggestedForYou";

const RightsideSection = () => {
  return (
    <div className="p-2 h-full hidden md:flex">
      <SuggestedForYou />
    </div>
  );
};

export default RightsideSection;
