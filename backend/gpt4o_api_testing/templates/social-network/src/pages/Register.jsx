import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const login = useUserStore((s) => s.login);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return setError("Please fill all fields");
    }

    login(form.email, form.password);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">

      <div className="p-8 bg-white dark:bg-gray-800 shadow-xl rounded-xl w-full max-w-md">

        <h1 className="text-3xl font-bold mb-6 dark:text-white">Create an Account</h1>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            placeholder="Full Name"
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Email"
            type="email"
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            placeholder="Password"
            type="password"
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700">
            Register
          </button>
        </form>

        <p className="text-center mt-5 text-sm dark:text-gray-400">
          Already have an account?
          <Link to="/login" className="text-blue-600 ml-1">Login</Link>
        </p>

      </div>
    </div>
  );
}
