import React from "react";
import { NavLink } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";

export default function NavBar() {
  const cart = useCartStore((s) => s.cart);

  const links = [
    { label: "Home", path: "/" },
    { label: "Menu", path: "/menu" },
    { label: "Reservation", path: "/reservation" },
    { label: "About", path: "/about" },
  ];

  return (
    <div className="fixed top-0 left-0 w-full backdrop-blur-xl bg-white/60 border-b border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">

        {/* Logo */}
        <h1 className="text-3xl font-extrabold tracking-wide text-gray-900">
          <span className="text-yellow-600">Gourmet</span> Palace
        </h1>

        {/* Links */}
        <div className="hidden md:flex gap-8">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-lg font-medium transition ${
                  isActive
                    ? "text-yellow-600 border-b-2 border-yellow-600 pb-1"
                    : "text-gray-700 hover:text-yellow-600"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Cart */}
        <NavLink to="/cart" className="relative">
          <span className="text-3xl">🛒</span>

          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-[2px] shadow-lg">
              {cart.length}
            </span>
          )}
        </NavLink>
      </div>
    </div>
  );
}
