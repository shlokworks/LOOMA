import React from "react";

export default function Footer() {
  return (
    <footer className="mt-10 p-6 text-center text-gray-500">
      © {new Date().getFullYear()} FitTrack Pro — All Rights Reserved.
    </footer>
  );
}
