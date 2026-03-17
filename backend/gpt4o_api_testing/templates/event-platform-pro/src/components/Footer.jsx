import React from "react";

export default function Footer() {
  return (
    <footer className="border-t mt-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10 text-center">
        <h2 className="text-xl font-bold mb-2">EventPro</h2>

        <p className="text-gray-500 mb-4">
          Connecting people through extraordinary events.
        </p>

        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} EventPro. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
