import React from "react";

export default function AgentCard({ agent }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-card hover:shadow-2xl transition duration-300">
      <div className="flex items-center gap-4">
        <img
          src={agent.image}
          alt={agent.name}
          className="w-20 h-20 rounded-xl object-cover shadow-soft"
        />

        <div>
          <h3 className="text-lg font-semibold text-neutral-800">
            {agent.name}
          </h3>
          <p className="text-sm text-neutral-500">{agent.email}</p>
          <p className="text-sm text-neutral-500">{agent.phone}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-medium text-brand-600">
          ⭐ {agent.rating}
        </span>

        <button className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm hover:bg-brand-700 transition">
          Contact
        </button>
      </div>
    </div>
  );
}
