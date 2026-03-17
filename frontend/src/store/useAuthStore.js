import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5050';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user:  null,   // { id, name, email }
      token: null,   // JWT string

      setAuth: (user, token) => set({ user, token }),

      logout: () => {
        set({ user: null, token: null });
      },

      /** Verify stored token is still valid; called on app boot. */
      verifyToken: async () => {
        const { token } = get();
        if (!token) return false;
        try {
          const res = await fetch(`${API}/auth/looma/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) { set({ user: null, token: null }); return false; }
          const { user } = await res.json();
          set({ user });
          return true;
        } catch {
          set({ user: null, token: null });
          return false;
        }
      },
    }),
    {
      name:    'looma-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
