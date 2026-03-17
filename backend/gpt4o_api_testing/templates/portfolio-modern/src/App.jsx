import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-20"> {/* offset for fixed header */}
        <Home />
      </main>
      <Footer />
    </div>
  );
}
