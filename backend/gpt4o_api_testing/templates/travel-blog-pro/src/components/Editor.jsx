import React from "react";

export default function Editor({ value, onChange }) {
  return (
    <textarea
      rows="10"
      className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Write your story..."
    ></textarea>
  );
}
