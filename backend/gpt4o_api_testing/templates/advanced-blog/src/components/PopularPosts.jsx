import React from "react";

const popular = [
  "Why React 19 is a Game Changer",
  "Mastering Async Patterns in JS",
  "Build Your Own API Gateway",
  "Better Auth with JWT + Refresh Tokens",
];

export default function PopularPosts() {
  return (
    <aside className="bg-white rounded-xl p-6 shadow sticky top-20 h-fit">
      <h3 className="text-lg font-bold mb-4">Popular Posts</h3>
      <ul className="space-y-3 text-gray-700">
        {popular.map((p, i) => (
          <li key={i} className="hover:text-blue-600 transition cursor-pointer">
            • {p}
          </li>
        ))}
      </ul>
    </aside>
  );
}
