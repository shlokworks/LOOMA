import React from "react";

export default function TestimonialCard({ quote, name }) {
  return (
    <div className="p-8 bg-white shadow-md rounded-xl border max-w-md mx-auto">
      <p className="text-gray-700 italic mb-4">“{quote}”</p>
      <h4 className="text-gray-900 font-bold">— {name}</h4>
    </div>
  );
}
