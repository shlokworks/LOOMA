import React from "react";

export default function CategoryGrid() {
  const categories = [
    { name: "Shoes", img: "https://images.unsplash.com/photo-1528701800489-20beafec7b18" },
    { name: "Watches", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30" },
    { name: "Headphones", img: "https://images.unsplash.com/photo-1519666213632-9be3df1a3a1a" }
  ];

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-6">Shop by Category</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <div key={i} className="relative h-44 rounded-xl overflow-hidden shadow hover:shadow-xl transition">
            <img src={cat.img} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <p className="text-white text-xl font-medium">{cat.name}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
