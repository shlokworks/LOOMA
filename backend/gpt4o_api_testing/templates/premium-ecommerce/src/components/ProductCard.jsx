import React from "react";

export default function ProductCard({ product }) {
  return (
    <div className="rounded-xl bg-white border shadow hover:shadow-xl transition overflow-hidden cursor-pointer">
      <div className="relative">
        <img src={product.img} className="h-56 w-full object-cover" />

        {product.label && (
          <span className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
            {product.label}
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-500 text-sm mt-1">{product.price}</p>

        <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
