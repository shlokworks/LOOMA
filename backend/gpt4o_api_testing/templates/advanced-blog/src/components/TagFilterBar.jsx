import React from "react";

const tags = ["React", "JavaScript", "DevOps", "Node.js", "CSS", "Backend", "AI"];

export default function TagFilterBar() {
  return (
    <div className="flex gap-3 overflow-x-auto py-3 mb-10 no-scrollbar">
      {tags.map((tag, i) => (
        <span
          key={i}
          className="px-4 py-1.5 text-sm bg-gray-200 hover:bg-blue-600 hover:text-white rounded-full transition cursor-pointer whitespace-nowrap"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
