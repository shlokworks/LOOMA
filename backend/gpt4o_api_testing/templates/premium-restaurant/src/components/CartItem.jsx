import React from "react";
import { useCartStore } from "../store/useCartStore";
import { updateQuantity, removeFromCart } from "../services/cartService";

export default function CartItem({ item }) {
  const { cart, setCart } = useCartStore();

  const changeQty = (qty) => {
    const updated = updateQuantity(cart, item.id, qty);
    setCart(updated);
  };

  const remove = () => {
    const updated = removeFromCart(cart, item.id);
    setCart(updated);
  };

  return (
    <div className="flex items-center justify-between bg-white p-5 rounded-xl shadow-md border hover:shadow-lg transition">

      <div>
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <p className="text-gray-500">${item.price}</p>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="number"
          value={item.quantity}
          min={1}
          onChange={(e) => changeQty(Number(e.target.value))}
          className="w-20 p-2 bg-gray-100 rounded-lg"
        />

        <button
          onClick={remove}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Remove
        </button>
      </div>

    </div>
  );
}
