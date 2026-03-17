import React from "react";

const JobFilter = ({ filter, setFilter, categories }) => {
  return (
    <div className="card p-5 rounded-xl mb-6">

      {/* Search */}
      <input
        type="text"
        placeholder="Search jobs..."
        className="input-dark w-full mb-4"
        value={filter.q}
        onChange={(e) => setFilter({ ...filter, q: e.target.value })}
      />

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Category */}
        <select
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          className="input-dark"
        >
          <option value="">All Categories</option>
          {categories.map((c, i) => (
            <option className="text-black" key={i} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Job Type */}
        <select
          value={filter.type}
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          className="input-dark"
        >
          <option value="">Job Type</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        {/* Location */}
        <input
          type="text"
          placeholder="Location"
          value={filter.location}
          onChange={(e) => setFilter({ ...filter, location: e.target.value })}
          className="input-dark"
        />
      </div>
    </div>
  );
};

export default JobFilter;
