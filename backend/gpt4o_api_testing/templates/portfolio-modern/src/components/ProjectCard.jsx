import React from "react";
import { motion } from "framer-motion";

export default function ProjectCard({ title, desc, image, tags }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition border bg-white"
    >
      <div className="h-40 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{desc}</p>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs bg-purple-100 text-purple-600 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
