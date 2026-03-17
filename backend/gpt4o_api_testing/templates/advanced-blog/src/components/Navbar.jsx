import React from "react";

export default function Navbar() {
  return (
    <nav className="p-5 bg-white shadow-md flex justify-between items-center">
      <h1 className="text-2xl font-bold">Advanced Blog</h1>
      <div className="flex gap-6 text-gray-600">
        <button>Home</button>
        <button>Posts</button>
        <button>Login</button>
      </div>
    </nav>
  );
}
