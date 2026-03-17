import React from "react";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";

const trending = [
  { name: "UltraPhone X", price: "$799", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9", label: "New" },
  { name: "Noise Pro 2", price: "$129", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796", label: "Hot" },
  { name: "Sport Runner", price: "$89", img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f", label: "-15%" },
  { name: "Classic Watch", price: "$199", img: "https://images.unsplash.com/photo-1511119485217-3a7c1b6d3e3b", label: "Top" }
];

export default function TrendingSlider() {
  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Trending Now</h2>
        <p className="text-sm text-gray-500">Handpicked popular products</p>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-6 pb-4">
          {trending.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className="w-64">
                <ProductCard product={p} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
