import React from "react";

export default function Stats() {
  const stats = [
    { num: "4+", label: "Years Experience" },
    { num: "50+", label: "Projects" },
    { num: "15+", label: "Technologies Used" },
  ];

  return (
    <section className="py-24 bg-gray-50 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
        {stats.map((s, i) => (
          <div key={i} className="p-6">
            <h3 className="text-5xl font-extrabold text-purple-600">{s.num}</h3>
            <p className="text-gray-600 mt-2">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
