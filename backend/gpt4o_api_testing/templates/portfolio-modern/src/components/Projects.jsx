import React from "react";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  const projects = [
    {
      title: "SaaS Dashboard",
      desc: "A fully responsive admin dashboard with charts, tables, and analytics.",
      tags: ["React", "Tailwind", "Recharts"],
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216"
    },
    {
      title: "Portfolio Website",
      desc: "Clean, modern personal website with animations and dynamic content.",
      tags: ["React", "Framer Motion"],
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
    },
    {
      title: "E-commerce UI",
      desc: "Elegant product grid, filters, and cart UI built with React.",
      tags: ["React", "Tailwind", "Stripe UI"],
      image: "https://images.unsplash.com/photo-1557821552-17105176677c"
    }
  ];

  return (
    <section id="projects" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-12">Projects</h2>

        <div className="grid md:grid-cols-3 gap-10">
          {projects.map((p, i) => (
            <ProjectCard key={i} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
