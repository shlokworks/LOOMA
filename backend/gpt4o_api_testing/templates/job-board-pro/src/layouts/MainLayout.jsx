import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f1115] text-gray-200">

      {/* Navbar */}
      <NavBar />

      {/* Page Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm border-t border-[#2a2d33]">
        © {new Date().getFullYear()} JobBoard Pro — All Rights Reserved
      </footer>

    </div>
  );
};

export default MainLayout;
