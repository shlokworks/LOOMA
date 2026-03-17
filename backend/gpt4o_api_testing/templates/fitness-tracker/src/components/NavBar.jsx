import React from "react";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  const links = [
    { label: "Dashboard", path: "/" },
    { label: "Workouts", path: "/workouts" },
    { label: "Nutrition", path: "/nutrition" },
    { label: "Progress", path: "/progress" },
    { label: "Goals", path: "/goals" }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold text-blue-600">FitTrack Pro</h1>

        <div className="hidden md:flex gap-6">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `font-medium ${
                  isActive ? "text-blue-600" : "text-gray-600"
                } hover:text-blue-600`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
