import React from "react";
import { getRestaurantDetails } from "../services/restaurantService";

export default function About() {
  const res = getRestaurantDetails();

  return (
    <div className="max-w-5xl mx-auto p-6 mt-12">

      <h2 className="text-4xl font-bold mb-6">About Us</h2>

      <p className="text-lg text-gray-700 leading-relaxed mb-10">
        {res.description}
      </p>

      <h3 className="text-3xl font-semibold mb-4">Opening Hours</h3>

      <div className="bg-white rounded-2xl shadow-lg p-6 border">
        <ul className="space-y-3 text-lg">
          {Object.entries(res.openingHours).map(([day, hours]) => (
            <li key={day} className="flex justify-between">
              <span className="font-semibold capitalize">{day}</span>
              <span className="text-gray-600">{hours}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
