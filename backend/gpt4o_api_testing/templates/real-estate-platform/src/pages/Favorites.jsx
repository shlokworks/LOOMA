import React from "react";
import PropertyCard from "../components/PropertyCard";
import useRealEstateStore from "../store/useRealEstateStore";

const Favorites = () => {
  const { favorites, properties } = useRealEstateStore();

  const favProperties = properties.filter((p) => favorites.includes(p.id));

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Your Favorites</h1>

      {favProperties.length === 0 && (
        <div className="text-center text-gray-500 py-20">
          <p className="text-lg">No favorite properties yet.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {favProperties.map((item) => (
          <PropertyCard key={item.id} property={item} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
