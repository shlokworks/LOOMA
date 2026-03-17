import jobs from "../mock/jobs.json";

const jobService = {
  getAll: () => jobs,

  getById: (id) => jobs.find((j) => j.id === id),

  getByCompany: (companyId) => jobs.filter((j) => j.companyId === companyId),

  search: (query) => {
    const q = query.toLowerCase();
    return jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q)
    );
  },

  filterByCategory: (category) =>
    jobs.filter((j) => j.category === category),

  filterByType: (type) =>
    jobs.filter((j) => j.jobType === type),

  filterByLocation: (location) => {
    const q = location.toLowerCase();
    return jobs.filter((j) =>
      j.location.toLowerCase().includes(q)
    );
  }
};

export default jobService;
