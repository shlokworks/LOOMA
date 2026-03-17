import { create } from "zustand";

import jobsData from "../mock/jobs.json";
import companiesData from "../mock/companies.json";
import categoriesData from "../mock/categories.json";

const SAVED_KEY = "jobboard_saved_jobs_v1";

// Load saved jobs from LS
const loadSaved = () => {
  const raw = localStorage.getItem(SAVED_KEY);
  return raw ? JSON.parse(raw) : [];
};

// Save to LS
const saveToLS = (data) => {
  localStorage.setItem(SAVED_KEY, JSON.stringify(data));
};

const useJobStore = create((set, get) => ({
  /* =====================================
       STATE
  ====================================== */
  jobs: [],
  companies: [],
  categories: [],
  filteredJobs: [],
  savedJobs: loadSaved(),

  /* =====================================
       LOADERS
  ====================================== */
  loadJobs: () => {
    set({ jobs: jobsData, filteredJobs: jobsData });
  },

  loadCompanies: () => {
    set({ companies: companiesData });
  },

  loadCategories: () => {
    set({ categories: categoriesData });
  },

  /* =====================================
       FILTERING ENGINE
  ====================================== */
  applyFilter: (filter) => {
    let result = [...get().jobs];

    // Search text
    if (filter.q) {
      const q = filter.q.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filter.category) {
      result = result.filter((job) => job.category === filter.category);
    }

    // Job Type
    if (filter.type) {
      result = result.filter((job) => job.jobType === filter.type);
    }

    // Location filter
    if (filter.location) {
      const l = filter.location.toLowerCase();
      result = result.filter((job) =>
        job.location.toLowerCase().includes(l)
      );
    }

    set({ filteredJobs: result });
  },

  /* =====================================
       SAVED JOBS
  ====================================== */
  saveJob: (job) => {
    const saved = get().savedJobs;
    const exists = saved.some((j) => j.id === job.id);

    if (!exists) {
      const updated = [...saved, job];
      saveToLS(updated);
      set({ savedJobs: updated });
    }
  },

  removeSavedJob: (jobId) => {
    const updated = get().savedJobs.filter((j) => j.id !== jobId);
    saveToLS(updated);
    set({ savedJobs: updated });
  }
}));

export default useJobStore;
