import React from "react";

export default function CategoryTabs({ categories, selected, onChange }) {
  const base =
    "px-5 py-2 rounded-full text-lg transition border shadow-sm";

  return (
    <div className="flex gap-4 justify-center mb-10 flex-wrap">

      <button
        onClick={() => onChange("All")}
        className={
          selected === "All"
            ? `${base} bg-black text-white border-black`
            : `${base} bg-gray-100 hover:bg-gray-200`
        }
      >
        All
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.name)}
          className={
            selected === cat.name
              ? `${base} bg-black text-white border-black`
              : `${base} bg-gray-100 hover:bg-gray-200`
          }
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
