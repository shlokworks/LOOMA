import React from "react";
import { Link } from "react-router-dom";
import useRealEstateStore from "../store/useRealEstateStore";

const PropertyCard = ({ property }) => {
  const { propertyTypes, locations } = useRealEstateStore();

  const typeName = propertyTypes.find((t) => t.id === property.typeId)?.name;
  const locationName = locations.find((l) => l.id === property.locationId);

  return (
    <Link
      to={`/property/${property.id}`}
      className="block bg-white rounded-2xl shadow hover:shadow-xl transition p-4 border"
    >
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-52 object-cover rounded-xl transform hover:scale-105 transition duration-300"
        />

        <span className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm shadow">
          {property.status}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-semibold">{property.title}</h3>
        <p className="text-gray-500 text-sm">{locationName}</p>

        <span className="inline-block text-xs bg-gray-100 px-3 py-1 rounded-full border">
          {typeName}
        </span>

        <div className="mt-3 flex justify-between text-sm text-gray-600">
          <span>{property.bedrooms} Beds</span>
          <span>{property.bathrooms} Baths</span>
          <span>{property.areaSqFt} sqft</span>
        </div>

        <p className="mt-3 text-blue-700 font-extrabold text-xl">
          ₹{property.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
};

export default PropertyCard;
