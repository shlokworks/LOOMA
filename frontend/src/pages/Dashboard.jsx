import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { useProjectStore } from "../store/useProjectStore";
import { apiGetProjects, apiDeleteProject, apiRenameProject } from "../utils/authApi";

const API = import.meta.env.VITE_API_URL || "http://localhost:5050";


function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return "just now";
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

const TYPE_COLOURS = { react: "bg-blue-500/20 text-blue-300", html: "bg-orange-500/20 text-orange-300", js: "bg-yellow-500/20 text-yellow-300" };

export default function Dashboard() {
  const navigate                       = useNavigate();
  const { user, token, logout }        = useAuthStore();
  const { setFiles, setProjectName, setProjectPath, setProjectId, setActiveFile } = useProjectStore();

  const [projects, setProjects]  = useState({ owned: [], shared: [] });
  const [projLoading, setProjLoading] = useState(true);
  const [renameId, setRenameId]  = useState(null);
  const [renameVal, setRenameVal] = useState("");
  const [deleteId, setDeleteId]  = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Load user's projects
  useEffect(() => {
    if (!token) return;
    apiGetProjects(token)
      .then(data => setProjects(data))
      .catch(console.error)
      .finally(() => setProjLoading(false));
  }, [token]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = () => setOpenMenuId(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleOpenProject = async (projectId) => {
    try {
      const res = await fetch(`${API}/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load project");
      setFiles(data.files || {});
      setProjectName(data.project.name);
      setProjectPath(data.project.project_path);
      setProjectId(data.project.id);
      if (Object.keys(data.files || {}).length) setActiveFile(Object.keys(data.files)[0]);
      navigate("/workspace");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiDeleteProject(token, id);
      setProjects(p => ({
        owned:  p.owned.filter(x => x.id !== id),
        shared: p.shared.filter(x => x.id !== id),
      }));
    } catch (err) { alert(err.message); }
    setDeleteId(null);
  };

  const handleRename = async (id) => {
    if (!renameVal.trim()) return;
    try {
      await apiRenameProject(token, id, renameVal.trim());
      setProjects(p => ({
        ...p,
        owned: p.owned.map(x => x.id === id ? { ...x, name: renameVal.trim() } : x),
      }));
    } catch (err) { alert(err.message); }
    setRenameId(null);
  };

  const allProjects = [
    ...projects.owned.map(p => ({ ...p, badge: "Owner" })),
    ...projects.shared.map(p => ({ ...p, badge: p.role || "Editor" })),
  ];

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white">
      {/* Top nav */}
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-base">L</span>
          </div>
          <span className="font-bold text-lg text-white">Looma</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/40 text-sm hidden sm:block">
            {user?.name}
          </span>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.[0]?.toUpperCase() || "?"}
          </div>
          <button
            onClick={() => { logout(); navigate("/auth"); }}
            className="text-white/40 hover:text-white text-sm transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero section */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-white mb-3">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {user?.name?.split(" ")[0]}
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Your AI-powered code generation studio. Describe an idea, get a full project — instantly.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              ),
              title: "AI Generation",
              desc: "Go from a one-line prompt to a complete, multi-file project in seconds using GPT-4o.",
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              ),
              title: "Real-time Collaboration",
              desc: "Invite teammates via email and edit code together live — Google Docs style, but for code.",
              gradient: "from-purple-500 to-pink-500",
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              ),
              title: "Live Preview",
              desc: "See your HTML, JS, and React projects render in real time as you write and edit code.",
              gradient: "from-orange-500 to-yellow-500",
            },
          ].map(({ icon, title, desc, gradient }) => (
            <div key={title} className="bg-white/3 border border-white/5 rounded-2xl p-5 hover:bg-white/5 hover:border-white/10 transition-all">
              <div className={`w-11 h-11 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white mb-4`}>
                {icon}
              </div>
              <h4 className="text-white font-semibold text-base mb-1">{title}</h4>
              <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* My Projects */}
        <div>
          <div className="flex items-center justify-between mb-5 gap-2">
            <div className="flex items-center gap-3">
              <h3 className="text-lg sm:text-xl font-bold text-white">My Projects</h3>
              <span className="text-white/30 text-sm">{allProjects.length} project{allProjects.length !== 1 ? "s" : ""}</span>
            </div>
            <button
              onClick={() => navigate("/new-project")}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl transition-all flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
              <span className="hidden sm:inline">New Project</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>

          {projLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white/3 border border-white/5 rounded-xl p-5 animate-pulse h-36" />
              ))}
            </div>
          ) : allProjects.length === 0 ? (
            <div className="text-center py-16 text-white/20">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="font-medium">No projects yet</p>
              <p className="text-sm mt-1">Generate your first project above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allProjects.map(project => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group bg-white/3 hover:bg-white/6 border border-white/5 hover:border-white/10 rounded-xl p-5 cursor-pointer transition-all relative"
                  onClick={() => handleOpenProject(project.id)}
                >
                  {/* Type badge */}
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLOURS[project.project_type] || "bg-white/10 text-white/50"}`}>
                      {project.project_type || "react"}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
                        {project.badge}
                      </span>
                      {/* 3-dot menu (only for owned) */}
                      {project.isOwner && (
                        <button
                          onClick={e => { e.stopPropagation(); setOpenMenuId(openMenuId === project.id ? null : project.id); }}
                          className="w-6 h-6 flex items-center justify-center rounded text-white/20 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  {renameId === project.id ? (
                    <input
                      autoFocus
                      value={renameVal}
                      onClick={e => e.stopPropagation()}
                      onChange={e => setRenameVal(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") handleRename(project.id); if (e.key === "Escape") setRenameId(null); }}
                      onBlur={() => handleRename(project.id)}
                      className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none"
                    />
                  ) : (
                    <h4 className="font-semibold text-white text-base mb-1 truncate">{project.name}</h4>
                  )}

                  {project.owner_name && (
                    <p className="text-white/30 text-xs mb-2">by {project.owner_name}</p>
                  )}

                  <p className="text-white/30 text-xs mt-auto">{timeAgo(project.updated_at || project.created_at)}</p>

                  {/* Dropdown menu */}
                  <AnimatePresence>
                    {openMenuId === project.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-4 top-12 z-20 bg-[#1e2436] border border-white/10 rounded-xl shadow-xl py-1 min-w-[140px]"
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          className="w-full px-4 py-2 text-left text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                          onClick={() => { setRenameId(project.id); setRenameVal(project.name); setOpenMenuId(null); }}
                        >
                          Rename
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                          onClick={() => { setDeleteId(project.id); setOpenMenuId(null); }}
                        >
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-[#1a1f2e] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <h3 className="text-white font-bold text-lg mb-2">Delete Project?</h3>
              <p className="text-white/50 text-sm mb-6">This will remove the project from your dashboard. The files on disk will not be deleted.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 transition-colors">Cancel</button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
