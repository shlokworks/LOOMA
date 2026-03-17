import React from "react";

const ProgressBar = ({ value = 0 }) => {
  const v = Math.max(0, Math.min(100, value));

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div
        className="h-3 bg-brand-purple rounded-full transition-all duration-500"
        style={{ width: `${v}%` }}
      />
    </div>
  );
};

export default ProgressBar;
