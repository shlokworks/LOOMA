import React from "react";
import TestimonialCard from "./TestimonialCard";
import { motion } from "framer-motion";

export default function Testimonials() {
  const testimonials = [
    { quote: "An exceptional developer with an eye for detail.", name: "Sarah Lin" },
    { quote: "Delivers projects with remarkable quality and speed.", name: "James Carter" },
    { quote: "One of the best designers I've worked with.", name: "Emily Turner" }
  ];

  return (
    <section id="testimonials" className="py-24 bg-gray-50 px-6">
      <h2 className="text-4xl font-bold text-center mb-12">Testimonials</h2>

      <motion.div
        className="flex gap-8 overflow-x-auto pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {testimonials.map((t, i) => (
          <motion.div key={i} className="min-w-[300px]">
            <TestimonialCard quote={t.quote} name={t.name} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
