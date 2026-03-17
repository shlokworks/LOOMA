import agents from "../mock/agents.json";
import properties from "../mock/properties.json";

const agentService = {
  getAll: () => {
    return agents;
  },

  getById: (id) => {
    return agents.find((a) => a.id === id);
  },

  getProperties: (agentId) => {
    return properties.filter((p) => p.agentId === agentId);
  },
};

export default agentService;
