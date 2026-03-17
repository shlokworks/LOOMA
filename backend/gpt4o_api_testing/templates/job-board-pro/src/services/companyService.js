import companies from "../mock/companies.json";

const companyService = {
  getAll: () => companies,

  getById: (id) => companies.find((c) => c.id === id)
};

export default companyService;
