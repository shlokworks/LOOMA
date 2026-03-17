import React, { useEffect } from "react";
import AgentCard from "../components/AgentCard";
import useRealEstateStore from "../store/useRealEstateStore";

const Agents = () => {
  const { agents, loadAgents } = useRealEstateStore();

  useEffect(() => {
    loadAgents();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-800 mb-10">
        Meet Our <span className="text-brand-500">Top Agents</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
};

export default Agents;
