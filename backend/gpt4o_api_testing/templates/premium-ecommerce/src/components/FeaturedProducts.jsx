import React from "react";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  const products = [
    {
      name: "Wireless Headphones",
      price: "$99.99",
      img: "https://images.unsplash.com/photo-1580894908361-9671950330b1",
      label: "Hot"
    },
    {
      name: "Smart Watch Pro",
      price: "$129.99",
      img: "https://images.unsplash.com/photo-1516715094483-75da7dee9758",
      label: "Trending"
    },
    {
      name: "Running Shoes",
      price: "$79.99",
      img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
      label: "-20%"
    }
  ];

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-6">Featured Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((p, i) => (
          <ProductCard key={i} product={p} />
        ))}
      </div>
    </section>
  );
}
