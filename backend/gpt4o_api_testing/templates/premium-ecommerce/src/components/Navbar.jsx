import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-extrabold tracking-tight">
          <span className="text-blue-600">Premium</span>Store
        </h1>

        <div className="hidden md:flex items-center bg-gray-100 px-4 py-2 rounded-full w-1/2">
          <svg xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-500 mr-2"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18.5a7.5 7.5 0 006.15-3.85z" />
          </svg>

          <input
            type="text"
            placeholder="Search for products..."
            className="bg-transparent w-full focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-6 text-gray-700 text-xl">
          <button className="hover:text-blue-600 transition">
            ❤️
          </button>

          <button className="hover:text-blue-600 transition">
            🛒
          </button>

          <button className="text-gray-700 font-medium hover:text-blue-600 transition">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}
