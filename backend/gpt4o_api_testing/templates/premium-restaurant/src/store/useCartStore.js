import { create } from "zustand";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  saveCartToStorage,
} from "../services/cartService";

export const useCartStore = create((set) => ({
  cart: JSON.parse(localStorage.getItem("cart")) || [],

  addItem: (item) =>
    set((state) => {
      const updated = addToCart(state.cart, item);
      saveCartToStorage(updated);
      return { cart: updated };
    }),

  setCart: (updated) =>
    set(() => {
      saveCartToStorage(updated);
      return { cart: updated };
    }),

  clearCart: () =>
    set(() => {
      saveCartToStorage([]);
      return { cart: [] };
    }),
}));
