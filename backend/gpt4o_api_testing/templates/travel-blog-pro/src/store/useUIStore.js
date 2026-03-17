import { create } from "zustand";

export const useUIStore = create((set) => ({
  loading: false,
  adminSidebarOpen: true,

  setLoading: (value) => set({ loading: value }),

  toggleAdminSidebar: () =>
    set((state) => ({
      adminSidebarOpen: !state.adminSidebarOpen,
    })),
}));
