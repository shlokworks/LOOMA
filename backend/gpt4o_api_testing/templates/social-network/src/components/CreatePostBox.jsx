import React, { useState } from "react";
import { createPost } from "../services/feedService";

export default function CreatePostBox({ onPost }) {
  const [text, setText] = useState("");

  const handlePost = () => {
    if (!text.trim()) return;

    const newPost = createPost(text);
    onPost && onPost(newPost);

    setText("");
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm mb-4 border dark:border-gray-700">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-lg resize-none text-gray-800 dark:text-gray-200"
        rows={3}
      />

      <div className="flex justify-between items-center mt-3">
        <div className="flex gap-4 text-xl">
          <button className="hover:text-blue-600">📷</button>
          <button className="hover:text-blue-600">🎥</button>
          <button className="hover:text-blue-600">😊</button>
        </div>

        <button
          onClick={handlePost}
          disabled={!text.trim()}
          className={`px-4 py-2 rounded-lg font-semibold transition
            ${
              text.trim()
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
        >
          Post
        </button>
      </div>
    </div>
  );
}
