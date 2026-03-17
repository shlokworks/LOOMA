import React, { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import PropertyFilter from "../components/PropertyFilter";
import Pagination from "../components/Pagination";
import useRealEstateStore from "../store/useRealEstateStore";

const Listings = () => {
  const {
    properties,
    loadProperties,
    filteredProperties,
    applyFilters,
    locations,
    propertyTypes,
  } = useRealEstateStore();

  const [filters, setFilters] = useState({
    location: "",
    type: "",
    minPrice: "",
    maxPrice: "",
  });

  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    applyFilters(filters);
    setPage(1);
  }, [filters]);

  const totalPages = Math.ceil(filteredProperties.length / pageSize);

  const pageData = filteredProperties.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-extrabold tracking-tight">Explore Listings</h1>
      <p className="text-gray-600">Find properties based on your preferences.</p>

      {/* Sticky Filter */}
      <div className="sticky top-20 z-20">
        <PropertyFilter
          filters={filters}
          setFilters={setFilters}
          locations={locations}
          propertyTypes={propertyTypes}
        />
      </div>

      {/* Listings */}
      {pageData.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg">
          No properties match the selected filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
          {pageData.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default Listings;
