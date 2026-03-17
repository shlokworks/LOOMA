import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* Top navigation */}
      <NavBar />

      {/* Main content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} CryptoPro Dashboard
      </footer>

    </div>
  );
};

export default MainLayout;
