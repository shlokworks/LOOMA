import { create } from "zustand";

export const useUIStore = create((set) => ({
  loading: false,
  organizerSidebarOpen: true,
  ticketModalOpen: false,

  setLoading: (value) => set({ loading: value }),

  toggleOrganizerSidebar: () =>
    set((state) => ({
      organizerSidebarOpen: !state.organizerSidebarOpen,
    })),

  openTicketModal: () => set({ ticketModalOpen: true }),
  closeTicketModal: () => set({ ticketModalOpen: false }),
}));
