import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t py-10 text-center text-gray-600">
      © {new Date().getFullYear()} PremiumStore — All rights reserved.
    </footer>
  );
}
