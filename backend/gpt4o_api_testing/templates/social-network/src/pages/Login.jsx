import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const login = useUserStore((s) => s.login);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return setError("Please fill all fields");
    }

    const success = login(form.email, form.password);
    if (!success) {
      return setError("Invalid credentials");
    }

    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">

      <div className="p-8 bg-white dark:bg-gray-800 shadow-xl rounded-xl w-full max-w-md transform transition-all">

        <h1 className="text-3xl font-bold mb-6 dark:text-white">Welcome Back</h1>

        {error && (
          <p className="mb-3 text-red-500 text-sm">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            placeholder="Email"
            type="email"
            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            name="password"
            placeholder="Password"
            type="password"
            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700">
            Login
          </button>
        </form>

        <p className="text-center mt-5 text-sm dark:text-gray-400">
          Don’t have an account?
          <Link to="/register" className="text-blue-600 ml-1">Register</Link>
        </p>

      </div>
    </div>
  );
}
