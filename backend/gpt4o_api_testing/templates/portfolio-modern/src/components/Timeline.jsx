import React from "react";

export default function Timeline() {
  const events = [
    { year: "2024", title: "Senior Frontend Engineer @ NovaTech" },
    { year: "2022", title: "Frontend Developer @ PixelForge" },
    { year: "2020", title: "Freelance UI/UX Designer & Developer" },
  ];

  return (
    <section id="timeline" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Experience</h2>

        <div className="relative border-l-4 border-purple-500 ml-4">
          {events.map((e, i) => (
            <div key={i} className="mb-10 ml-6">
              <div className="absolute -left-3 top-1 w-6 h-6 bg-purple-500 rounded-full"></div>

              <h3 className="text-xl font-bold">{e.year}</h3>
              <p className="text-gray-600">{e.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
