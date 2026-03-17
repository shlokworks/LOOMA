import properties from "../mock/properties.json";

const propertyService = {
  getAll: () => {
    return properties;
  },

  getById: (id) => {
    return properties.find((p) => p.id === id);
  },

  getByAgent: (agentId) => {
    return properties.filter((p) => p.agentId === agentId);
  },

  search: (query) => {
    const q = query.toLowerCase();
    return properties.filter((p) =>
      p.title.toLowerCase().includes(q)
    );
  },
};

export default propertyService;
