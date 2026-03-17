// components/TopBar.jsx
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore }  from "../store/useAuthStore";
import OnlineUsers from "./OnlineUsers";

export default function TopBar({
  name,
  onExport,
  onNewFile,
  onNewFolder,
  onToggleGit,
  showGitSidebar,
  isExporting,
  onToggleCollaborators,
  showCollaborators,
  onlineUsers = [],
}) {
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout }       = useAuthStore();
  const navigate               = useNavigate();

  const handleLogout = () => { logout(); navigate("/auth"); };

  return (
    <div className={`border-b px-4 py-3 shadow-sm flex items-center justify-between gap-3 ${
      theme === "dark"
        ? "bg-gray-900 border-gray-700"
        : "bg-white border-gray-200"
    }`}>
      {/* Left: logo + project name */}
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={() => navigate("/dashboard")} className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity">
            <span className="text-white font-bold text-sm">L</span>
          </div>
        </button>
        <div className="min-w-0">
          <h1 className={`font-bold truncate text-base ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
            {name}
          </h1>
          <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            Looma AI
          </p>
        </div>
      </div>

      {/* Online users (collab) */}
      {onlineUsers.length > 0 && (
        <div className="hidden sm:block">
          <OnlineUsers users={onlineUsers} />
        </div>
      )}

      {/* Right: actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Theme */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-colors ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
          title="Toggle theme"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {/* Collaborators */}
        <button
          onClick={onToggleCollaborators}
          title="Collaborators"
          className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-1.5 ${
            showCollaborators
              ? "bg-purple-600 text-white"
              : theme === "dark"
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span className="hidden sm:inline">Share</span>
        </button>

        {/* Git */}
        <button
          onClick={onToggleGit}
          className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-1.5 ${
            showGitSidebar
              ? "bg-green-500 text-white"
              : theme === "dark"
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
          </svg>
          <span className="hidden sm:inline">Git</span>
        </button>

        {/* New Folder */}
        <button
          onClick={onNewFolder}
          className="hidden sm:flex px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium text-sm transition-colors items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          </svg>
          Folder
        </button>

        {/* New File */}
        <button
          onClick={onNewFile}
          className="hidden sm:flex px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition-colors items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          File
        </button>

        {/* Export */}
        <button
          onClick={onExport}
          disabled={isExporting}
          className="px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-1.5"
        >
          {isExporting ? (
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
          )}
          <span className="hidden sm:inline">{isExporting ? "Exporting..." : "Export"}</span>
        </button>

        {/* User avatar */}
        <div className="relative group">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer">
            {user?.name?.[0]?.toUpperCase() || "?"}
          </div>
          {/* Hover tooltip with logout */}
          <div className="absolute right-0 top-10 bg-[#1e2436] border border-white/10 rounded-xl shadow-xl py-1 min-w-[140px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50">
            <div className="px-3 py-2 border-b border-white/5">
              <p className="text-white text-xs font-medium truncate">{user?.name}</p>
              <p className="text-white/40 text-xs truncate">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-white/5 transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
