import React from "react";
import { useParams, Link } from "react-router-dom";
import { getMenuItemById } from "../services/menuService";
import { useCartStore } from "../store/useCartStore";

export default function ItemDetails() {
  const { id } = useParams();
  const item = getMenuItemById(id);
  const add = useCartStore((s) => s.addItem);

  if (!item) {
    return <p className="text-center mt-20 text-xl">Item not found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-24 p-6">

      {/* TOP SECTION */}
      <div className="grid md:grid-cols-2 gap-10">

        {/* Dish Image */}
        <div>
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-[400px] object-cover rounded-2xl shadow-xl"
          />
        </div>

        {/* Dish Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-2">{item.name}</h1>

          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            {item.description}
          </p>

          <p className="text-3xl font-bold text-yellow-600 mb-6">
            ${item.price}
          </p>

          <button
            onClick={() => add(item)}
            className="px-8 py-3 bg-black text-white text-lg rounded-xl shadow hover:bg-gray-900 transition"
          >
            Add to Cart
          </button>

          <Link to="/menu">
            <p className="mt-6 text-gray-500 hover:text-black transition text-sm underline cursor-pointer">
              ← Back to Menu
            </p>
          </Link>
        </div>
      </div>

      {/* EXTRA DESCRIPTION */}
      <div className="mt-16 text-lg text-gray-700 leading-relaxed">
        <p>
          Our chefs prepare {item.name} with utmost precision, using authentic
          ingredients and premium herbs. Each plate is crafted to perfection,
          offering a dining experience you will remember.
        </p>
      </div>
    </div>
  );
}
