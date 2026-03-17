import React from "react";

export default function Register() {
  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <h1 className="text-3xl font-extrabold mb-6">Register</h1>

      <form className="space-y-6">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="email"
          placeholder="Email Address"
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg"
        />

        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg w-full">
          Create Account
        </button>
      </form>
    </div>
  );
}
