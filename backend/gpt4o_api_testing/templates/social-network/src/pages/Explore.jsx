import React from "react";

export default function Explore() {
  const trending = [
    "#ReactJS", "#OpenAI", "#TailwindCSS",
    "#WebDev", "#AI", "#Startups", "#JavaScript"
  ];

  const creators = [
    { id: 1, name: "Sarah Kim", username: "@sarahkim", avatar: "https://i.pravatar.cc/150?img=5" },
    { id: 2, name: "Michael Chen", username: "@mikechen", avatar: "https://i.pravatar.cc/150?img=12" },
    { id: 3, name: "Aditi Sharma", username: "@aditi.sharma", avatar: "https://i.pravatar.cc/150?img=20" }
  ];

  return (
    <div className="max-w-3xl mx-auto mt-20 p-4">

      <h2 className="text-2xl font-bold mb-6 dark:text-white">Explore</h2>

      {/* Trending Topics */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-xl font-semibold mb-3 dark:text-white">
          Trending Topics
        </h3>

        <div className="flex flex-wrap gap-3">
          {trending.map((tag, i) => (
            <span
              key={i}
              className="px-4 py-2 bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300 rounded-full font-medium cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-600 transition"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Suggested Creators */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm">
        <h3 className="text-xl font-semibold mb-4 dark:text-white">
          Suggested Creators
        </h3>

        <div className="space-y-4">
          {creators.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src={u.avatar}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold dark:text-white">{u.name}</p>
                  <p className="text-gray-500 text-sm dark:text-gray-400">{u.username}</p>
                </div>
              </div>

              <button className="px-4 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
