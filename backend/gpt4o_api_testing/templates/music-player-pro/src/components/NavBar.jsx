import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="bg-white shadow p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        <Link to="/" className="text-2xl font-bold">MusicPlayer Pro</Link>

        <div className="flex gap-6 text-sm">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/songs" className="hover:text-blue-600">Songs</Link>
          <Link to="/albums" className="hover:text-blue-600">Albums</Link>
          <Link to="/artists" className="hover:text-blue-600">Artists</Link>
          <Link to="/favorites" className="hover:text-blue-600">Favorites</Link>
        </div>

      </div>
    </nav>
  );
};

export default NavBar;
