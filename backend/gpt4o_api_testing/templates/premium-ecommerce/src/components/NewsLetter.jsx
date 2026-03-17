import React from "react";

export default function Newsletter() {
  return (
    <section className="bg-gray-100 rounded-xl p-10 text-center mb-20">
      <h3 className="text-2xl font-bold mb-3">Join Our Newsletter</h3>

      <p className="text-gray-600 mb-6">
        Get updates on new arrivals, discounts, and special offers.
      </p>

      <div className="flex justify-center gap-3">
        <input
          type="email"
          placeholder="Enter your email"
          className="px-4 py-2 rounded-lg bg-white border w-80"
        />

        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Subscribe
        </button>
      </div>
    </section>
  );
}
