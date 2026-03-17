import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },

  logout: () =>
    set(() => {
      localStorage.removeItem("token");
      return { user: null, token: null };
    }),
}));
