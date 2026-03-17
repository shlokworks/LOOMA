import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LEFT — Brand */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 dark:text-blue-400"
        >
          Looma Social
        </Link>

        {/* CENTER — Search Bar */}
        <div className="hidden md:block w-96">
          <input
            type="text"
            placeholder="Search users, posts..."
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* RIGHT — Icons */}
        <div className="flex items-center gap-5">

          {/* Notifications */}
          <NavLink
            to="/notifications"
            className="relative text-gray-700 dark:text-gray-300 hover:text-blue-600"
          >
            🔔
            <span className="absolute -top-1 -right-2 text-xs bg-red-600 text-white px-1.5 py-0.5 rounded-full">
              3
            </span>
          </NavLink>

          {/* Chat */}
          <NavLink
            to="/chat"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 text-lg"
          >
            💬
          </NavLink>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Profile Avatar Dropdown */}
          <div className="relative">
            <img
              src="https://i.pravatar.cc/150?img=32"
              alt="profile"
              onClick={() => setOpenMenu(!openMenu)}
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-blue-500"
            />

            {openMenu && (
              <div className="absolute right-0 mt-3 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("auth");
                    window.location.href = "/login";
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
