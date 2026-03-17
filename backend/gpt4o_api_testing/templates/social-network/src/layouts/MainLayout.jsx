import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import RightBar from "../components/RightBar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />

      <div className="flex pt-16 px-2 md:px-6">
        {/* Left Sidebar */}
        <aside className="hidden md:block w-60 lg:w-64 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <SideBar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 mx-2 md:mx-6 min-h-screen pb-10">
          <Outlet />
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:block w-72 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <RightBar />
        </aside>
      </div>
    </div>
  );
}
