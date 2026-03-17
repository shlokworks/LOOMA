// src/utils/fileApi.js
const API = `${import.meta.env.VITE_API_URL || 'http://localhost:5050'}/api/files`;

const withCredentials = (opts = {}) => ({
  credentials: "include",
  ...opts,
});

export const saveFile = async (projectPath, filePath, content) => {
  const res = await fetch(`${API}/write`, withCredentials({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectPath, filePath, content })
  }));
  return res.json();
};

export const readFile = async (projectPath, filePath) => {
  const res = await fetch(`${API}/read?projectPath=${encodeURIComponent(projectPath)}&filePath=${encodeURIComponent(filePath)}`, withCredentials());
  return res.json();
};
