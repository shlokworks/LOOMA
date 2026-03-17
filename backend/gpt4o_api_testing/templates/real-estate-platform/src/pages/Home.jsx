import React, { useEffect } from "react";
import PropertyCard from "../components/PropertyCard";
import useRealEstateStore from "../store/useRealEstateStore";

const Home = () => {
  const { properties, loadProperties } = useRealEstateStore();

  useEffect(() => {
    loadProperties();
  }, []);

  const featured = properties.slice(0, 6);

  return (
    <div>
      {/* HERO SECTION */}
      <div className="relative mb-14">
        <div className="rounded-3xl overflow-hidden shadow-xl h-[380px] bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format')"
          }}
        >
          <div className="w-full h-full bg-black/40 flex flex-col justify-center px-10 text-white">
            <h1 className="text-4xl md:text-5xl font-extrabold max-w-2xl leading-tight">
              Find Your Dream Home Today
            </h1>
            <p className="mt-3 text-lg opacity-90 max-w-xl">
              Browse premium properties, explore neighborhoods, and connect with trusted agents.
            </p>

            {/* SEARCH BAR */}
            <div className="mt-6 max-w-lg">
              <input
                type="text"
                placeholder="Search for location, property type..."
                className="w-full px-5 py-3 rounded-xl text-gray-800 shadow-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* PROPERTY CATEGORIES */}
      <div className="flex gap-4 mb-10 overflow-x-auto no-scrollbar">
        {["House", "Apartment", "Villa", "Office", "Studio", "Land"].map((cat) => (
          <span
            key={cat}
            className="px-5 py-2 bg-white shadow rounded-full border hover:bg-blue-600 hover:text-white transition cursor-pointer"
          >
            {cat}
          </span>
        ))}
      </div>

      {/* FEATURED PROPERTIES */}
      <h2 className="text-3xl font-bold mb-6">Featured Properties</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {featured.map((item) => (
          <PropertyCard key={item.id} property={item} />
        ))}
      </div>
    </div>
  );
};

export default Home;
