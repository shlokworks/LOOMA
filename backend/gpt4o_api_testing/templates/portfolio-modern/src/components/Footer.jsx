import React from "react";

export default function Footer() {
  return (
    <footer className="mt-auto py-6 bg-gradient-to-r from-gray-100 to-gray-200 text-center text-gray-600 text-sm">
      © {new Date().getFullYear()} Modern Portfolio — All Rights Reserved.
    </footer>
  );
}
