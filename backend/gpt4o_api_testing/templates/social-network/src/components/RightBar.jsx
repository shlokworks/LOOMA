import React from "react";
import users from "../mocks/users.json";

export default function RightBar() {
  const suggested = users.slice(0, 4);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 dark:text-white">
        Suggested for you
      </h2>

      <div className="space-y-3">
        {suggested.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border"
              />
              <div>
                <p className="font-semibold dark:text-gray-100">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user.username}
                </p>
              </div>
            </div>

            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
