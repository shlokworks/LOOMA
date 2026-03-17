import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="pt-20 pb-10">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}
