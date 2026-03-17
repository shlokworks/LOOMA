// src/utils/gitApi.js
const API = `${import.meta.env.VITE_API_URL || 'http://localhost:5050'}/api/git`;
const AUTH = `${import.meta.env.VITE_API_URL || 'http://localhost:5050'}/auth/github`;

/* --------------------------------------------------------
   LOCAL GIT
--------------------------------------------------------- */

const withCredentials = (opts = {}) => ({
  credentials: "include",
  ...opts,
});

export const getGitStatus = async (projectPath) => {
  const res = await fetch(`${API}/status?projectPath=${encodeURIComponent(projectPath)}`, withCredentials());
  return res.json();
};

export const initGitRepo = async (projectPath) => {
  const res = await fetch(`${API}/init`, withCredentials({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectPath }),
  }));
  return res.json();
};

export const commitChanges = async (projectPath, message) => {
  const res = await fetch(`${API}/commit`, withCredentials({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectPath, message }),
  }));
  return res.json();
};

export const getHistory = async (projectPath, limit = 20) => {
  const res = await fetch(`${API}/history?projectPath=${encodeURIComponent(projectPath)}&limit=${limit}`, withCredentials());
  return res.json();
};

export const listBranches = async (projectPath) => {
  const res = await fetch(`${API}/branches?projectPath=${encodeURIComponent(projectPath)}`, withCredentials());
  return res.json();
};

export const getDiff = async (projectPath, filePath, staged = false) => {
  const res = await fetch(`${API}/diff?projectPath=${encodeURIComponent(projectPath)}&filePath=${encodeURIComponent(filePath)}&staged=${staged}`, withCredentials());
  return res.json();
};

export const stageFile = async (projectPath, filePath) => {
  const res = await fetch(`${API}/stage`, withCredentials({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectPath, filePath }),
  }));
  return res.json();
};

export const unstageFile = async (projectPath, filePath) => {
  const res = await fetch(`${API}/unstage`, withCredentials({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectPath, filePath }),
  }));
  return res.json();
};

export const getRepoInfo = async (projectPath) => {
  const res = await fetch(`${API}/info?projectPath=${encodeURIComponent(projectPath)}`, withCredentials());
  return res.json();
};

export const switchBranch = async (projectPath, branchName) => {
  const res = await fetch(`${API}/switch-branch`, withCredentials({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectPath, branchName }),
  }));
  return res.json();
};

export const createBranch = async (projectPath, branchName) => {
  const res = await fetch(`${API}/create-branch`, withCredentials({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectPath, branchName }),
  }));
  return res.json();
};

export const deleteBranch = async (projectPath, branchName) => {
  const res = await fetch(`${API}/delete-branch`, withCredentials({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectPath, branchName }),
  }));
  return res.json();
};

/* --------------------------------------------------------
   GITHUB AUTH + PUSH
--------------------------------------------------------- */

// Open GitHub OAuth login
export const openGithubLogin = () => {
  window.open(`${AUTH}/login`, "_blank", "noopener,noreferrer");
};

// Check login status
export const githubStatus = async () => {
  const res = await fetch(`${AUTH}/status`, withCredentials());
  return res.json();
};

// Create GitHub repo
export const createGithubRepo = async (repoName) => {
  const res = await fetch(`${API}/github/create-repo`, withCredentials({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repoName }),
  }));
  return res.json();
};

// Push local project → GitHub repo
export const pushAllToGithub = async (repoFullName, projectPath) => {
  const res = await fetch(`${API}/github/push`, withCredentials({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repoFullName, projectPath }),
  }));
  return res.json();
};
