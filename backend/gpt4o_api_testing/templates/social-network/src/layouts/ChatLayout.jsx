import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function ChatLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />

      <main className="pt-16 px-2 md:px-6 max-w-4xl mx-auto pb-10">
        <Outlet />
      </main>
    </div>
  );
}
