import React from "react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center items-center text-center px-6"
    >
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-6"
      >
        Hi, I'm Alex — Web Developer
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl text-gray-600 text-lg"
      >
        I craft clean, modern digital experiences with React, Tailwind, and
        delightful user-centric design.
      </motion.p>

      <div className="mt-10 flex gap-4">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
          View Projects
        </button>
        <button className="px-6 py-3 border border-gray-400 rounded-xl hover:bg-gray-100">
          Contact Me
        </button>
      </div>
    </section>
  );
}
