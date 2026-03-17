import React from "react";

export default function StarRating({ rating }) {
  const filled = Math.floor(rating);
  const half = rating % 1 !== 0;

  return (
    <div className="flex items-center text-yellow-500">

      {Array.from({ length: filled }).map((_, i) => (
        <span key={i} className="text-lg">★</span>
      ))}

      {half && <span className="text-lg">☆</span>}
    </div>
  );
}
