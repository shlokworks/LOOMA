import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="bg-white shadow p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        <Link to="/" className="text-2xl font-bold tracking-tight">
          CryptoPro
        </Link>

        <div className="flex gap-6 text-sm">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/markets" className="hover:text-blue-600">Markets</Link>
          <Link to="/portfolio" className="hover:text-blue-600">Portfolio</Link>
          <Link to="/alerts" className="hover:text-blue-600">Alerts</Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
