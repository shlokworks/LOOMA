import { create } from "zustand";
import users from "../mocks/users.json";

export const useUserStore = create((set, get) => ({
  currentUser: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: localStorage.getItem("auth") === "true",

  // LOGIN
  login: (email, password) => {
    const user = users.find((u) => u.email === email) || null;

    if (!user) return false;

    localStorage.setItem("auth", "true");
    localStorage.setItem("user", JSON.stringify(user));

    set({ currentUser: user, isAuthenticated: true });
    return true;
  },

  // LOGOUT
  logout: () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    set({ currentUser: null, isAuthenticated: false });
  },

  // FOLLOW / UNFOLLOW (client simulation)
  followUser: (targetId) => {
    const currentUser = get().currentUser;

    if (!currentUser.following.includes(targetId)) {
      currentUser.following.push(targetId);
    }

    localStorage.setItem("user", JSON.stringify(currentUser));
    set({ currentUser });
  },

  unfollowUser: (targetId) => {
    const currentUser = get().currentUser;
    currentUser.following = currentUser.following.filter((id) => id !== targetId);

    localStorage.setItem("user", JSON.stringify(currentUser));
    set({ currentUser });
  },

  // THEME
  theme: localStorage.getItem("theme") || "light",
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      return { theme: newTheme };
    }),
}));
