import React from "react";

const Footer = () => {
  return (
    <footer className="mt-20 bg-white border-t">
      <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-500">
        <p className="text-sm">
          © {new Date().getFullYear()} RealEstatePro — All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
