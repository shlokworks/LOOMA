import React from "react";
import { Link } from "react-router-dom";
import StarRating from "./StarRating";

export default function MenuCard({ item }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border hover:shadow-xl hover:-translate-y-1 transition-all duration-200">

      <img
        src={item.image}
        alt={item.name}
        className="h-48 w-full object-cover"
      />

      <div className="p-5">
        <h3 className="text-2xl font-semibold">{item.name}</h3>
        <p className="text-gray-500 text-sm mt-1">{item.category}</p>

        <div className="flex items-center justify-between mt-4">
          <StarRating rating={item.rating} />
          <span className="text-xl font-bold text-yellow-600">
            ${item.price}
          </span>
        </div>

        <Link to={`/menu/${item.id}`}>
          <button className="mt-5 w-full px-4 py-2 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 transition">
            View Details
          </button>
        </Link>
      </div>

    </div>
  );
}
