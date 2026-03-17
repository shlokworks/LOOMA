import React from "react";

export default function AuthorCard() {
  return (
    <div className="flex items-center gap-4 mt-4">
      <img
        src="https://i.pravatar.cc/100?img=12"
        className="w-12 h-12 rounded-full"
      />
      <div>
        <p className="font-medium">Aarav Desai</p>
        <p className="text-sm text-gray-500">Full-Stack Engineer</p>
      </div>
    </div>
  );
}
