// src/components/GitSidebar.jsx
import React, { useState, useEffect } from "react";
import { useThemeStore } from "../store/useThemeStore";
import { useProjectStore } from "../store/useProjectStore";

import GitHubPushModal from "./GitHubPushModal";
import GitCommitModal from "./GitCommitModal";
import GitFileList from "./GitFileList";
import GitDiffPanel from "./GitDiffPanel";
import GitBranchDropdown from "./GitBranchDropdown";

import {
  getGitStatus,
  initGitRepo,
  getHistory,
  listBranches,
  githubStatus,
  openGithubLogin,
  getRepoInfo,
  pushAllToGithub
} from "../utils/gitApi";

const GitSidebar = ({ projectPath, onCommit, onBranchChange }) => {
  const { theme } = useThemeStore();

  // -------- Global Store --------
  const githubRepoFullName = useProjectStore((s) => s.githubRepoFullName);
  const setGithubRepoFullName = useProjectStore((s) => s.setGithubRepoFullName);

  // -------- Local State --------
  const [gitStatus, setGitStatus] = useState(null);
  const [busyMessage, setBusyMessage] = useState("");  // ⭐ NEW: Loader message

  const [history, setHistory] = useState([]);
  const [branches, setBranches] = useState([]);
  const [currentBranch, setCurrentBranch] = useState("main");

  const [githubConnected, setGithubConnected] = useState(false);
  const [githubEmail, setGithubEmail] = useState(null);

  const [showCommitModal, setShowCommitModal] = useState(false);
  const [showPushModal, setShowPushModal] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [stagedFilesCount, setStagedFilesCount] = useState(0);

  // INITIAL LOAD
  useEffect(() => {
    if (projectPath) refreshAll();
  }, [projectPath]);

  const refreshAll = async () => {
    await loadGitStatus();
    await loadHistory();
    await loadBranches();
    await loadGithubStatus();
    await loadRepoInfo();
  };

  const loadGitStatus = async () => {
    try {
      const res = await getGitStatus(projectPath);
      setGitStatus(res);
      setStagedFilesCount(res?.staged?.length || 0);
    } catch {
      setGitStatus({ success: false, hasGit: false });
    }
  };

  const loadHistory = async () => {
    try {
      const res = await getHistory(projectPath);
      if (res.success) setHistory(res.commits);
      else setHistory([]);
    } catch {
      setHistory([]);
    }
  };

  const loadBranches = async () => {
    try {
      const res = await listBranches(projectPath);
      if (res.success) {
        setBranches(res.branches || []);
        setCurrentBranch(res.current || res.branches?.[0] || "main");
      }
    } catch {}
  };

  const loadGithubStatus = async () => {
    try {
      const res = await githubStatus();
      setGithubConnected(!!res.connected);
      setGithubEmail(res.email || null);
    } catch {
      setGithubConnected(false);
      setGithubEmail(null);
    }
  };

  const loadRepoInfo = async () => {
    try {
      const res = await getRepoInfo(projectPath);
      if (res.success) setStagedFilesCount(res.stagedCount || 0);
    } catch {}
  };

  // ---------------- GitHub Login ----------------
  const triggerGithubLogin = () => {
    setBusyMessage("Connecting to GitHub...");
    openGithubLogin();

    const poll = setInterval(async () => {
      const res = await githubStatus();
      if (res.connected) {
        clearInterval(poll);
        setBusyMessage("");
        setGithubConnected(true);
        setGithubEmail(res.email);
        alert(`Connected as ${res.email}`);
      }
    }, 1200);
  };

  // ---------------- Git Init ----------------
  const handleInitGit = async () => {
    setBusyMessage("Initializing Git repository...");

    const res = await initGitRepo(projectPath);
    setBusyMessage("");

    if (res.success) {
      alert("Git initialized");
      refreshAll();
    } else {
      alert("Init failed: " + res.error);
    }
  };

  // ---------------- Commit ----------------
  const handleCommit = () => setShowCommitModal(true);

  const afterCommit = async () => {
    setShowCommitModal(false);
    refreshAll();
    onCommit && onCommit();
  };

  // ---------------- PUSH LOGIC ----------------
  const handlePush = async () => {
    if (!gitStatus?.hasGit) return alert("Initialize Git first.");

    if (!githubConnected) {
      if (window.confirm("Connect GitHub?")) triggerGithubLogin();
      return;
    }

    // ✔ Direct push if repo name already saved
    if (githubRepoFullName) {
      setBusyMessage("Pushing to GitHub...");

      const res = await pushAllToGithub(githubRepoFullName, projectPath);

      setBusyMessage("");

      if (res.success) alert("Pushed to GitHub!");
      else alert("Push failed: " + res.error);
      return;
    }

    // First-time push → open creation modal
    setShowPushModal(true);
  };

  return (
    <>
      <div className={`h-full border-l flex flex-col ${theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>

        {/* HEADER */}
        <div className="p-4 flex items-center justify-between">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <span className="text-green-500">●</span> Version Control
          </h3>

          <div className="flex items-center gap-2">
            <button onClick={refreshAll} className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700">Refresh</button>

            <GitBranchDropdown
              projectPath={projectPath}
              branches={branches}
              currentBranch={currentBranch}
              onChange={(b) => {
                setCurrentBranch(b);
                onBranchChange && onBranchChange(b);
                refreshAll();
              }}
            />
          </div>
        </div>

        {/* NO GIT UI */}
        {!gitStatus?.hasGit ? (
          <div className="px-4">
            <div className="p-4 border border-dashed rounded-lg text-center">
              <p className="text-sm text-gray-500 mb-3">No Git repository found</p>

              <div className="flex gap-2 justify-center">
                <button onClick={handleInitGit} className="px-4 py-2 rounded-lg bg-green-600 text-white">Initialize Git</button>
                <button onClick={triggerGithubLogin} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700">Connect GitHub</button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* ACTIONS */}
            <div className="px-4 space-y-3">
              <div className="flex gap-2">
                <button onClick={handleCommit} className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border rounded-lg">
                  Commit Changes {stagedFilesCount > 0 ? `(${stagedFilesCount})` : ""}
                </button>

                <button onClick={handlePush} className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow">
                  Push ↗
                </button>
              </div>

              {/* GitHub Info */}
              <div className="pt-2 text-sm">
                <div className="text-xs text-gray-500">GitHub</div>

                {githubConnected ? (
                  <div className="flex items-center justify-between">
                    <div>{githubEmail}</div>
                    <button onClick={triggerGithubLogin} className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">
                      Reconnect
                    </button>
                  </div>
                ) : (
                  <button onClick={triggerGithubLogin} className="mt-2 px-3 py-1 text-sm rounded bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    Connect GitHub
                  </button>
                )}
              </div>
            </div>

            {/* FILE LIST + DIFF */}
            <div className="flex-1 overflow-hidden flex">
              <div className="w-64 border-r overflow-auto">
                <GitFileList
                  projectPath={projectPath}
                  gitStatus={gitStatus}
                  onSelectFile={setSelectedFile}
                  onStagedChange={loadGitStatus}
                />
              </div>

              <div className="flex-1 p-3">
                <GitDiffPanel
                  projectPath={projectPath}
                  filePath={selectedFile}
                  staged={false}
                  onRefresh={refreshAll}
                />
              </div>
            </div>

            {/* COMMITS LIST */}
            <div className="mt-auto p-4">
              <h4 className="font-semibold mb-2 text-sm text-gray-600 dark:text-gray-400">Recent Commits</h4>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {history.length === 0 && <div className="text-sm text-gray-400">No commits yet</div>}
                {history.map((c) => (
                  <div key={c.hash} className="border-l-2 border-green-400 pl-3 py-1 text-sm">
                    <div className="font-medium">{c.message}</div>
                    <div className="text-xs text-gray-500">{c.date} • {c.hash.slice(0, 7)}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* COMMIT MODAL */}
      {showCommitModal && (
        <GitCommitModal
          onClose={() => setShowCommitModal(false)}
          projectPath={projectPath}
          onCommitted={afterCommit}
        />
      )}

      {/* PUSH MODAL */}
      {showPushModal && (
        <GitHubPushModal
          onClose={() => setShowPushModal(false)}
          projectPath={projectPath}
          githubEmail={githubEmail}
          saveRepoName={(name) => setGithubRepoFullName(name)}
          onPushed={() => refreshAll()}
        />
      )}

      {/* 🔥 GLOBAL LOADER OVERLAY */}
      {busyMessage && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl text-center">
            <div className="animate-spin border-4 border-gray-300 border-t-blue-500 w-10 h-10 rounded-full mx-auto mb-4"></div>
            <div className="text-sm font-medium">{busyMessage}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default GitSidebar;
