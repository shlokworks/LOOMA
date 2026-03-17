import React, { useState } from "react";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/useAuthStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setToken = useAuthStore((s) => s.setToken);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await authService.login(email, password);
    setToken(res.token);
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <h1 className="text-3xl font-extrabold mb-6">Login</h1>

      <form onSubmit={handleLogin} className="space-y-6">
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />

        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg w-full">
          Login
        </button>
      </form>
    </div>
  );
}
