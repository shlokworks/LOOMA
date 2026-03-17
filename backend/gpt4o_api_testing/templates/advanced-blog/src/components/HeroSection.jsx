import React from "react";

export default function HeroSection() {
  return (
    <section className="mb-12">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-10 shadow-lg">
        <h1 className="text-4xl font-extrabold mb-3">
          Welcome to the Advanced Dev Blog
        </h1>
        <p className="text-lg opacity-90 max-w-2xl">
          Tutorials, deep dives, and guides written for real developers.
        </p>

        <button className="mt-6 px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold shadow hover:bg-gray-100 transition">
          Start Reading →
        </button>
      </div>
    </section>
  );
}
