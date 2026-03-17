import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="bg-[#111318] border-b border-[#2a2d33] py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4">

        {/* Brand */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-white"
        >
          JobBoard <span className="text-indigo-400">Pro</span>
        </Link>

        {/* Navigation */}
        <div className="flex gap-6 text-sm">
          {[
            { to: "/", label: "Home" },
            { to: "/jobs", label: "Jobs" },
            { to: "/companies", label: "Companies" },
            { to: "/saved", label: "Saved" }
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-gray-300 hover:text-indigo-400 transition"
            >
              {item.label}
            </Link>
          ))}
        </div>

      </div>
    </nav>
  );
};

export default NavBar;
