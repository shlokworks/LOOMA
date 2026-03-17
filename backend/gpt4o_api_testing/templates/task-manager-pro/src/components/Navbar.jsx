import React from "react";

export default function Navbar() {
  return (
    <header className="bg-white shadow p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-semibold">Task Manager Pro</h1>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm">New Board</button>
          <button className="px-3 py-1 rounded-md border text-sm">Sign in</button>
        </div>
      </div>
    </header>
  );
}
