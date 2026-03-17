import React from "react";

export default function Testimonials() {
  const reviews = [
    { name: "Sarah", text: "Amazing quality products! Fast shipping." },
    { name: "James", text: "Great prices and excellent customer service." },
    { name: "Emily", text: "My go-to store for premium accessories." }
  ];

  return (
    <section className="mb-20">
      <h2 className="text-3xl font-bold mb-8 text-center">What Customers Say</h2>

      <div className="grid sm:grid-cols-3 gap-8">
        {reviews.map((r, i) => (
          <div key={i} className="p-6 bg-white border rounded-xl shadow hover:shadow-lg transition">
            <p className="text-gray-700 italic mb-4">"{r.text}"</p>
            <h4 className="text-gray-900 font-semibold">— {r.name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
}
