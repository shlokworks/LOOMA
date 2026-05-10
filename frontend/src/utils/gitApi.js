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

const GITHUB_TOKEN_KEY = "looma_github_token";

export const saveGithubToken = (token) => localStorage.setItem(GITHUB_TOKEN_KEY, token);
export const clearGithubToken = () => localStorage.removeItem(GITHUB_TOKEN_KEY);
export const getGithubToken = () => localStorage.getItem(GITHUB_TOKEN_KEY);

const withGithubAuth = (opts = {}) => {
  const token = getGithubToken();
  return {
    credentials: "include",
    ...opts,
    headers: {
      ...(opts.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

// Open GitHub OAuth login (redirects back with ?githubToken= in the URL)
export const openGithubLogin = () => {
  window.location.href = `${AUTH}/login`;
};

// Check login status
export const githubStatus = async () => {
  const res = await fetch(`${AUTH}/status`, withGithubAuth());
  return res.json();
};

// Create GitHub repo
export const createGithubRepo = async (repoName) => {
  const res = await fetch(`${API}/github/create-repo`, withGithubAuth({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repoName }),
  }));
  return res.json();
};

// Push local project → GitHub repo
export const pushAllToGithub = async (repoFullName, projectPath) => {
  const res = await fetch(`${API}/github/push`, withGithubAuth({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repoFullName, projectPath }),
  }));
  return res.json();
};
