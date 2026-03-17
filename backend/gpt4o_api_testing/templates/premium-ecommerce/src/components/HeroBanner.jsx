import React from "react";

export default function HeroBanner() {
  return (
    <section className="relative h-[60vh] rounded-2xl overflow-hidden mb-16">
      <img
        className="w-full h-full object-cover"
        src="https://images.unsplash.com/photo-1556740749-887f6717d7e4"
      />

      <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-white text-5xl font-extrabold tracking-tight">
          Discover Your Style
        </h1>

        <p className="text-gray-200 mt-4 max-w-xl">
          Premium products curated just for you. Shop the latest trends.
        </p>

        <button className="mt-6 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition">
          Shop Now
        </button>
      </div>
    </section>
  );
}
