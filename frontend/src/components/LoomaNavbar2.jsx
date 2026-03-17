import React from "react";
import { useNavigate } from "react-router-dom";

export default function LoomaNavbar({ dark, setDark }) {
  const navigate = useNavigate();

  return (
    <nav className="z-30 relative flex items-center justify-between px-10 pt-7 pb-2">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center font-extrabold text-[1.45rem] text-[#6c54bb] tracking-tight dark:text-[#cfc1ff]">
          <svg className="h-6 w-6 mr-2" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="18" fill="#bcb2fa" />
            <ellipse cx="22" cy="22" rx="8" ry="18" fill="#8fa5ff" />
            <circle cx="22" cy="22" r="6" fill="#fff" />
          </svg>
          Looma
        </span>
      </div>
      <div className="flex items-center gap-4 text-base font-medium">
        <button
          className="px-5 py-2 rounded-full font-bold bg-white/60 dark:bg-[#2a2747] text-[#483c7a] dark:text-[#bdbbff] shadow hover:scale-105 border border-[#e3dfff] dark:border-[#392d66] transition"
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </button>
        {/* Dark mode toggle */}
        <button
          className="ml-2 text-xl"
          onClick={() => setDark((d) => !d)}
          title="Toggle dark mode"
        >
          {dark ? "🌞" : "🌙"}
        </button>
      </div>
    </nav>
  );
}