import React, { useState } from "react";

export default function EventFilters() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6">
      <input
        type="text"
        placeholder="Search events..."
        className="flex-1 p-3 border rounded-lg"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="p-3 border rounded-lg w-full md:w-64"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        <option value="Tech">Tech</option>
        <option value="Business">Business</option>
        <option value="Health">Health</option>
        <option value="Art">Art</option>
      </select>
    </div>
  );
}
