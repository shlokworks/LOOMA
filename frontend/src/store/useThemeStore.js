// src/store/useThemeStore.js
import { create } from "zustand";
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'dark', // 'dark' or 'light'
      
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'dark' ? 'light' : 'dark' 
      })),
      
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
      // Better persistence configuration
      onRehydrateStorage: () => (state) => {
        // Apply theme to document when store rehydrates
        if (state?.theme) {
          document.documentElement.classList.toggle('dark', state.theme === 'dark');
        }
      }
    }
  )
);