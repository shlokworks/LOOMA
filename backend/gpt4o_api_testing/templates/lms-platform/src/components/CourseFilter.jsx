import React from "react";

const CourseFilter = ({ filter, setFilter, categories }) => {
  return (
    <div className="card p-4 mb-6">
      <div className="flex gap-3">

        {/* Search */}
        <input
          value={filter.q}
          onChange={(e) => setFilter({ ...filter, q: e.target.value })}
          placeholder="Search courses..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-brand-purple outline-none"
        />

        {/* Category */}
        <select
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-brand-purple outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

      </div>
    </div>
  );
};

export default CourseFilter;
