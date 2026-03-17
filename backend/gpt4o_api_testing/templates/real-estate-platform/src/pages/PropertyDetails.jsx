import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import propertyService from "../services/propertyService";
import agentService from "../services/agentService";
import useRealEstateStore from "../store/useRealEstateStore";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [agent, setAgent] = useState(null);

  const { addFavorite } = useRealEstateStore();

  useEffect(() => {
    const p = propertyService.getById(id);
    setProperty(p);

    if (p) {
      const ag = agentService.getById(p.agentId);
      setAgent(ag);
    }
  }, [id]);

  if (!property) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto">

      <img
        src={property.image}
        alt={property.title}
        className="w-full h-72 object-cover rounded-lg"
      />

      <h1 className="text-3xl font-bold mt-4">{property.title}</h1>
      <p className="text-gray-600">{property.location}</p>

      <p className="text-xl text-blue-600 font-semibold mt-3">
        ₹{property.price.toLocaleString()}
      </p>

      <div className="mt-4 flex gap-3">
        <span>{property.beds} Beds</span>
        <span>{property.baths} Baths</span>
        <span>{property.area} sqft</span>
      </div>

      <p className="mt-6">{property.description}</p>

      <button
        onClick={() => addFavorite(property.id)}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Add to Favorites
      </button>

      {agent && (
        <div className="mt-8 p-4 border rounded bg-white shadow">
          <h2 className="text-xl font-bold">Agent Details</h2>
          <p className="font-semibold mt-2">{agent.name}</p>
          <p className="text-gray-600">{agent.company}</p>
          <p className="text-blue-600 mt-1">{agent.phone}</p>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
