import React from "react";

export default function Footer() {
  return (
    <footer className="border-t mt-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8 text-center">
        <h2 className="text-xl font-semibold mb-2">TravelMag</h2>

        <p className="text-gray-500 mb-4">
          Explore. Experience. Share your journey.
        </p>

        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} TravelMag. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
