import { create } from "zustand";
import {
  getAllReservations,
  createReservation,
} from "../services/reservationService";

export const useReservationStore = create((set) => ({
  reservations: getAllReservations(),
  lastMessage: null,

  addReservation: (data) => {
    const result = createReservation(data);

    if (!result.success) {
      set({ lastMessage: result.message });
      return;
    }

    set((state) => ({
      reservations: [...state.reservations, result.reservation],
      lastMessage: result.message,
    }));
  },
}));
