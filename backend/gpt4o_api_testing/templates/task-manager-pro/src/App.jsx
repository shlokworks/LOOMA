import React from "react";
import Navbar from "./components/Navbar.jsx";
import Board from "./pages/Board.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-6">
        <Board />
      </main>
      <Footer />
    </div>
  );
}
