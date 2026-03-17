import React from "react";
import speakers from "../mock/speakers.json";

export default function Speakers() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-extrabold mb-8">Speakers</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {speakers.map((sp) => (
          <div
            key={sp.id}
            className="bg-white shadow rounded-xl p-6 text-center"
          >
            <img
              src={sp.photo}
              alt={sp.name}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h2 className="text-xl font-bold">{sp.name}</h2>
            <p className="text-gray-500">{sp.profession}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
