import React from "react";
import useLMSStore from "../store/useLMSStore";

const Profile = () => {
  const { currentUser } = useLMSStore();

  if (!currentUser)
    return <div className="text-gray-500 text-center mt-10">No user loaded</div>;

  return (
    <div className="max-w-md mx-auto card p-8 mt-10">

      <div className="flex items-center gap-4">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-20 h-20 rounded-full object-cover"
        />

        <div>
          <h2 className="text-2xl font-bold text-gray-900">{currentUser.name}</h2>
          <p className="text-gray-600">{currentUser.email}</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs text-gray-500 uppercase tracking-wide">Role</p>
        <p className="text-brand-purple text-lg font-semibold">{currentUser.role}</p>
      </div>
    </div>
  );
};

export default Profile;
