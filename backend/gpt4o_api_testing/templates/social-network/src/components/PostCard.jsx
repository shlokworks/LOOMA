import React, { useState } from "react";
import users from "../mocks/users.json";

export default function PostCard({ post }) {
  const user = users.find((u) => u.id === post.userId);
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLikes((p) => (liked ? p - 1 : p + 1));
    setLiked(!liked);
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border dark:border-gray-700 mb-5">
      
      {/* Top Section */}
      <div className="flex items-center gap-3">
        <img
          src={user?.avatar}
          className="w-11 h-11 rounded-full"
        />
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            {user?.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            @{user?.username} · {post.timeAgo || "2h ago"}
          </p>
        </div>
      </div>

      {/* Post Text */}
      <p className="mt-3 text-gray-800 dark:text-gray-200 leading-relaxed">
        {post.content}
      </p>

      {/* Optional Image */}
      {post.image && (
        <img
          src={post.image}
          className="mt-4 rounded-xl w-full max-h-80 object-cover"
        />
      )}

      {/* Actions */}
      <div className="flex gap-6 mt-4 text-gray-500 dark:text-gray-400 text-lg">

        <button onClick={toggleLike} className="flex items-center gap-2">
          {liked ? "❤️" : "🤍"} <span className="text-sm">{likes}</span>
        </button>

        <button className="hover:text-blue-600 dark:hover:text-blue-400">
          💬
        </button>

        <button className="hover:text-blue-600 dark:hover:text-blue-400">
          🔗
        </button>

        <button className="hover:text-blue-600 dark:hover:text-blue-400">
          📌
        </button>
      </div>
    </div>
  );
}
