import React from "react";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 mt-20 py-10">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-white">
          Gourmet <span className="text-yellow-500">Palace</span>
        </h2>

        <p className="text-sm mt-3 opacity-80">
          Fine Dining • Luxury Ambience • Culinary Excellence
        </p>

        <p className="text-xs text-gray-500 mt-6">
          © {new Date().getFullYear()} Gourmet Palace. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
