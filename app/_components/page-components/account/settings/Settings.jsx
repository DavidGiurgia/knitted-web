
import React from "react";

const Settings = ({goBack}) => {
  return (
    <div className="w-full h-full">
      Settings
      <button onClick={() => goBack()}>Back</button>
    </div>
  );
};

export default Settings;
