import React from "react";
import { getRestaurantDetails } from "../services/restaurantService";

export default function Home() {
  const restaurant = getRestaurantDetails();

  return (
    <div className="w-full">

      {/* HERO SECTION */}
      <div className="relative w-full h-[70vh]">
        <img
          src={restaurant.bannerImage}
          alt="restaurant banner"
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/80 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-5xl md:text-6xl font-extrabold drop-shadow-lg tracking-wide">
            {restaurant.heroTagline}
          </h1>

          <p className="mt-4 text-gray-200 text-lg md:text-xl max-w-2xl">
            Experience fine dining with world-class flavors & ambiance
          </p>

          <a
            href="/reservation"
            className="mt-8 px-8 py-3 bg-yellow-500 text-black font-semibold rounded-full text-lg shadow-lg hover:bg-yellow-600 transition"
          >
            Reserve a Table
          </a>
        </div>
      </div>

      {/* DESCRIPTION SECTION */}
      <div className="max-w-5xl mx-auto mt-16 p-6 text-center">
        <h2 className="text-3xl font-bold mb-4">A Culinary Experience</h2>

        <p className="text-lg text-gray-700 leading-relaxed">
          {restaurant.description}
        </p>
      </div>

      {/* FEATURED DISHES */}
      <div className="max-w-6xl mx-auto mt-16 px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Dishes</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurant.featuredDishes?.map((dish) => (
            <div
              key={dish.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-[1.02] transition"
            >
              <img src={dish.image} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{dish.name}</h3>
                <p className="text-gray-600 mt-2">{dish.description}</p>
                <p className="mt-3 text-lg font-bold text-yellow-600">
                  ${dish.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
