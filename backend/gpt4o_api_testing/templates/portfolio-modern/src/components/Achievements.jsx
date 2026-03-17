import React from "react";

export default function Achievements() {
  const items = [
    { title: "50+ Projects Completed", icon: "🏆" },
    { title: "10+ Happy Clients", icon: "🤝" },
    { title: "5+ Years of Experience", icon: "⏳" },
  ];

  return (
    <section id="achievements" className="py-24 bg-white px-6">
      <h2 className="text-4xl font-bold text-center mb-12">Achievements</h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {items.map((a, i) => (
          <div
            key={i}
            className="p-8 rounded-2xl border bg-white shadow-sm hover:shadow-xl transition text-center"
          >
            <div className="text-6xl mb-4">{a.icon}</div>
            <h3 className="text-xl font-bold">{a.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
