import React from "react";

const PropertyFilter = ({ filters, setFilters, locations, propertyTypes }) => {
  return (
    <div className="bg-white/80 backdrop-blur-md border shadow-lg p-5 rounded-2xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Location */}
        <select
          className="border rounded-lg px-4 py-2"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>

        {/* Property Type */}
        <select
          className="border rounded-lg px-4 py-2"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">All Types</option>
          {propertyTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        {/* Min Price */}
        <input
          type="number"
          placeholder="Min Price"
          className="border rounded-lg px-4 py-2"
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
        />

        {/* Max Price */}
        <input
          type="number"
          placeholder="Max Price"
          className="border rounded-lg px-4 py-2"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
        />
      </div>
    </div>
  );
};

export default PropertyFilter;
