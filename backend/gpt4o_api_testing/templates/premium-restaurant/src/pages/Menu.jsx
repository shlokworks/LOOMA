import React, { useState } from "react";
import { getAllMenuItems, getMenuByCategory } from "../services/menuService";
import categories from "../mock/categories.json";
import MenuCard from "../components/MenuCard";

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const menuItems =
    selectedCategory === "All"
      ? getAllMenuItems()
      : getMenuByCategory(selectedCategory);

  return (
    <div className="max-w-7xl mx-auto p-6 mt-6">

      <h2 className="text-4xl font-bold mb-10 text-center">Our Exquisite Menu</h2>

      {/* CATEGORY TABS */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-6 py-2 rounded-full text-lg shadow ${
            selectedCategory === "All"
              ? "bg-black text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-6 py-2 rounded-full text-lg shadow ${
              selectedCategory === cat.name
                ? "bg-black text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* MENU GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {menuItems.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>

    </div>
  );
}
