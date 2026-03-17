import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Brand */}
        <Link
          to="/"
          className="text-2xl font-bold text-brand-purple tracking-tight"
        >
          LMS <span className="text-brand-pink">Pro</span>
        </Link>

        {/* Navigation */}
        <nav className="flex gap-6 text-sm font-medium text-gray-600">
          <Link
            to="/courses"
            className="hover:text-brand-purple transition"
          >
            Courses
          </Link>
          <Link
            to="/dashboard"
            className="hover:text-brand-purple transition"
          >
            Dashboard
          </Link>
          <Link
            to="/profile"
            className="hover:text-brand-pink transition"
          >
            Profile
          </Link>
        </nav>

      </div>
    </header>
  );
};

export default NavBar;
