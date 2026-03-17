import React from "react";

export default function Skills() {
  const skillGroups = {
    "Frontend": [
      { name: "React", level: 90 },
      { name: "TailwindCSS", level: 85 },
      { name: "HTML/CSS", level: 95 },
      { name: "Framer Motion", level: 75 },
    ],
    "Backend": [
      { name: "Node.js", level: 70 },
      { name: "Express", level: 65 },
      { name: "MongoDB", level: 60 },
    ],
    "Tools": [
      { name: "Git / GitHub", level: 90 },
      { name: "Figma", level: 85 },
      { name: "Vite", level: 80 },
    ],
  };

  return (
    <section id="skills" className="py-24 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Skills</h2>

        <div className="grid md:grid-cols-3 gap-12">
          {Object.entries(skillGroups).map(([group, skills]) => (
            <div key={group}>
              <h3 className="text-xl font-semibold mb-4">{group}</h3>

              {skills.map((skill, i) => (
                <div key={i} className="mb-5">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">{skill.name}</span>
                    <span className="text-gray-500 text-sm">{skill.level}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className="h-full bg-purple-600 rounded-full"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
