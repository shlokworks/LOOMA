import React from "react";
import { useCartStore } from "../store/useCartStore";
import CartItem from "../components/CartItem";
import { calculateTotal } from "../services/cartService";
import { Link } from "react-router-dom";

export default function Cart() {
  const cart = useCartStore((s) => s.cart);
  const total = calculateTotal(cart);

  return (
    <div className="max-w-5xl mx-auto p-6 mt-8">

      <h2 className="text-4xl font-bold mb-8">Your Cart</h2>

      {cart.length === 0 ? (
        <p className="text-xl mt-10 text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* TOTAL BOX */}
          <div className="mt-8 p-6 bg-white rounded-2xl shadow-xl border">
            <div className="flex justify-between text-xl mb-4">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-lg text-gray-500">
              <span>Service Charge (5%)</span>
              <span>${(total * 0.05).toFixed(2)}</span>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-2xl font-bold">
              <span>Total</span>
              <span>${(total * 1.05).toFixed(2)}</span>
            </div>

            <Link to="/order">
              <button className="mt-6 w-full py-3 bg-black text-white rounded-xl font-semibold text-lg hover:bg-gray-800 transition">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
