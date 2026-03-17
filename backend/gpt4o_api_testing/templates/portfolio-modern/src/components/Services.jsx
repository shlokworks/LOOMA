import React from "react";
import { motion } from "framer-motion";

export default function Services() {
  const services = [
    {
      title: "UI/UX Design",
      desc: "Modern, intuitive & accessible designs tailored around user experience.",
      icon: "🎨"
    },
    {
      title: "Frontend Development",
      desc: "High-performance React applications with clean architecture.",
      icon: "💻"
    },
    {
      title: "Brand Identity",
      desc: "Logos, color systems & design guidelines for consistent branding.",
      icon: "✨"
    }
  ];

  return (
    <section id="services" className="py-24 bg-gray-50 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">Services</h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          I help brands and businesses create impactful digital experiences.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          {services.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl shadow-md bg-white border hover:shadow-xl transition"
            >
              <div className="text-5xl mb-4">{s.icon}</div>
              <h3 className="text-xl font-bold mb-3">{s.title}</h3>
              <p className="text-gray-600">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
