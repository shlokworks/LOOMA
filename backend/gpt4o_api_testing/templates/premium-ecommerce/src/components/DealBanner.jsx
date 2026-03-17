import React from "react";

export default function DealBanner() {
  return (
    <section className="bg-blue-600 text-white rounded-xl py-10 px-6 mb-16 text-center">
      <h3 className="text-3xl font-extrabold mb-2">🔥 Big Sale is Live!</h3>
      <p className="opacity-90">Up to 50% off on top categories.</p>

      <button className="mt-5 px-8 py-3 bg-white text-blue-600 rounded-full font-medium hover:bg-gray-100 transition">
        Explore Deals
      </button>
    </section>
  );
}
