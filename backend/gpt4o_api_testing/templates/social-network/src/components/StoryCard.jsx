import React from "react";

export default function StoryCard({ user }) {
  return (
    <div className="w-24 h-40 bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden cursor-pointer hover:scale-105 transition-all border dark:border-gray-700">
      
      <div className="flex justify-center mt-3">
        <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-pink-500 to-yellow-400">
          <img
            src={user.avatar}
            className="w-full h-full rounded-full border-2 border-white object-cover"
          />
        </div>
      </div>

      <p className="text-center mt-2 text-sm font-semibold dark:text-white px-2 truncate">
        {user.name}
      </p>
    </div>
  );
}
