import React from "react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* Profile Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <div className="w-64 h-64 rounded-3xl overflow-hidden shadow-xl border">
            <img
              src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe"
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4">About Me</h2>

          <p className="text-gray-600 leading-relaxed mb-6">
            I'm a passionate Frontend Developer focused on creating elegant,
            user-friendly interfaces. My goal is to blend aesthetics with
            functionality — building digital products that feel delightful and
            intuitive.
            <br /> <br />
            I specialize in React, TailwindCSS, and interaction design. I love
            clean code, smooth animations, and modern UI patterns.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mb-6">
            {["linkedin", "github", "twitter"].map((icon) => (
              <a
                key={icon}
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
              >
                <img
                  src={`https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${icon}.svg`}
                  className="w-5 h-5 invert opacity-80"
                />
              </a>
            ))}
          </div>

          <button className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition">
            Download Resume
          </button>
        </motion.div>

      </div>
    </section>
  );
}
