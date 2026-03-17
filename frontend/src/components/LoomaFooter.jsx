import React from "react";

export default function LoomaFooter() {
  return (
    <footer>
      <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-center md:justify-between gap-6 md:gap-0 text-[#7e7bf5] dark:text-[#a499e6] text-base font-normal opacity-85">
        <a href="#" className="hover:underline">Terms of Service</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <a href="#" className="hover:underline">Contact</a>
      </div>
      <div className="mt-5 text-xs text-[#7e7bf5] dark:text-[#a499e6] opacity-60 ">
        &copy; {new Date().getFullYear()} Looma. All rights reserved.
      </div>
    </footer>
  );
}