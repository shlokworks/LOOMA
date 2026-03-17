import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-blue-600">
          RealEstate<span className="text-gray-700">Pro</span>
        </Link>

        {/* Navigation Items */}
        <div className="flex gap-8 text-gray-700 font-medium">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <Link to="/listings" className="hover:text-blue-600 transition">Listings</Link>
          <Link to="/agents" className="hover:text-blue-600 transition">Agents</Link>
          <Link to="/favorites" className="hover:text-blue-600 transition">Favorites</Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
