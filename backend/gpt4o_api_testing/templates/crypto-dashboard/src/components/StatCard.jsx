import React from "react";

const StatCard = ({ label, value, subtext }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {subtext && <p className="text-gray-400 text-sm mt-1">{subtext}</p>}
    </div>
  );
};

export default StatCard;
