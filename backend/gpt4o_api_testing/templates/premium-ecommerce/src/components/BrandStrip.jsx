import React from "react";

export default function BrandsStrip() {
  const brands = ["Nike", "Adidas", "Sony", "Apple", "Samsung"];

  return (
    <section className="py-10 mb-16 bg-white border rounded-xl">
      <div className="flex justify-center gap-12 flex-wrap text-gray-600 text-xl font-semibold">
        {brands.map((b, i) => (
          <span key={i} className="opacity-70 hover:opacity-100 transition">
            {b}
          </span>
        ))}
      </div>
    </section>
  );
}
