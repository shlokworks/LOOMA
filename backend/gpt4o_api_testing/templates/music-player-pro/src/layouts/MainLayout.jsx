import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import PlayerBar from "../components/PlayerBar";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* PlayerBar is fixed to bottom inside the layout */}
      <PlayerBar />

      <footer className="text-center py-6 text-gray-500 text-sm mt-20">
        © {new Date().getFullYear()} MusicPlayer Pro
      </footer>
    </div>
  );
};

export default MainLayout;
