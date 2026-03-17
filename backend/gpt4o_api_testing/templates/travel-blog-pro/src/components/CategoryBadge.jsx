import React from "react";

export default function CategoryBadge({ name }) {
  return (
    <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded-full">
      {name}
    </span>
  );
}
