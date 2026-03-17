import React, { useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { submitOrder } from "../services/orderService";

export default function Order() {
  const cart = useCartStore((s) => s.cart);
  const clearCart = useCartStore((s) => s.clearCart);

  const [info, setInfo] = useState({ name: "", phone: "", address: "" });
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = submitOrder(cart, info);
    setStatus(result.message);

    if (result.success) clearCart();
  };

  return (
    <div className="max-w-4xl mx-auto mt-28 p-6">
      <h2 className="text-4xl font-bold mb-8">Order Checkout</h2>

      {status && (
        <p className="p-4 bg-green-100 text-green-700 rounded-xl mb-6 text-center font-semibold">
          {status}
        </p>
      )}

      {/* ORDER SUMMARY */}
      <div className="bg-white rounded-2xl shadow-xl border p-6 mb-10">

        <h3 className="text-2xl font-semibold mb-4">
          Order Summary
        </h3>

        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <ul className="space-y-3">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex justify-between text-lg border-b pb-2"
              >
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* CUSTOMER INFO FORM */}
      <form className="space-y-5" onSubmit={handleSubmit}>
        <input
          className="w-full p-3 bg-gray-100 rounded-lg"
          placeholder="Full Name"
          required
          onChange={(e) => setInfo({ ...info, name: e.target.value })}
        />

        <input
          className="w-full p-3 bg-gray-100 rounded-lg"
          placeholder="Phone Number"
          required
          onChange={(e) => setInfo({ ...info, phone: e.target.value })}
        />

        <textarea
          className="w-full p-3 bg-gray-100 rounded-lg"
          placeholder="Delivery Address"
          rows={4}
          required
          onChange={(e) => setInfo({ ...info, address: e.target.value })}
        ></textarea>

        <button className="mt-4 px-6 py-3 bg-black text-white rounded-xl font-semibold text-lg w-full hover:bg-gray-900 transition">
          Place Order
        </button>
      </form>
    </div>
  );
}
