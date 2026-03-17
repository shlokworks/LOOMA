import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  { label: "Home", path: "/", icon: "🏠" },
  { label: "Explore", path: "/explore", icon: "🔍" },
  { label: "Notifications", path: "/notifications", icon: "🔔" },
  { label: "Profile", path: "/profile", icon: "👤" },
  { label: "Chat", path: "/chat", icon: "💬" }
];

export default function SideBar() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Menu</h2>

      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow"
                    : "dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
