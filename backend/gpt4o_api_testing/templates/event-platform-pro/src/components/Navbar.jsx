import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const links = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: "Speakers", path: "/speakers" },
    { name: "Schedule", path: "/schedule" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <header className="w-full border-b bg-white sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-3xl font-extrabold tracking-tight text-blue-600">
          Event<span className="text-gray-800">Pro</span>
        </h1>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-lg font-medium">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `transition ${
                  isActive
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-600"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <NavLink
            to="/login"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Login
          </NavLink>
        </nav>

        {/* Mobile Placeholder */}
        <div className="md:hidden">
          <span className="text-2xl">☰</span>
        </div>
      </div>
    </header>
  );
}
