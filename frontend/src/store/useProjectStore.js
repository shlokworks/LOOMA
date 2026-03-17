// src/store/useProjectStore.js
import { create } from "zustand";

export const useProjectStore = create((set, get) => ({
  projectName: "",
  files: {},
  activeFile: "",
  projectStructure: {},

  projectPath: "",
  setProjectPath: (path) => set({ projectPath: path }),

  projectId: "",
  setProjectId: (id) => set({ projectId: id }),

  isTemplate: false,
  setIsTemplate: (value) => set({ isTemplate: value }),

  githubRepoFullName: "",
  setGithubRepoFullName: (name) => set({ githubRepoFullName: name }),

  setProjectName: (name) => set({ projectName: name }),

  setFiles: (files) =>
    set((state) => {
      const newFiles = files || {};
      const keys = Object.keys(newFiles);
      const first = keys.length ? keys[0] : "";

      const structure = buildFolderStructure(newFiles);

      return {
        files: newFiles,
        projectStructure: structure,
        activeFile: state.activeFile || first,
      };
    }),

  setActiveFile: (path) => set({ activeFile: path }),

  addFile: (filePath, content) =>
    set((state) => {
      const newFiles = { ...state.files, [filePath]: content };
      return {
        files: newFiles,
        projectStructure: buildFolderStructure(newFiles),
        activeFile: filePath,
      };
    }),

  addFolder: (folderPath) =>
    set((state) => {
      const clean = folderPath.endsWith("/") ? folderPath : folderPath + "/";
      const newFiles = { ...state.files, [clean]: "" };
      return {
        files: newFiles,
        projectStructure: buildFolderStructure(newFiles),
      };
    }),

  updateFileStructure: (newFiles) =>
    set({
      files: newFiles,
      projectStructure: buildFolderStructure(newFiles),
    }),
}));

// ------------------ Helper Functions ------------------

function buildFolderStructure(files) {
  const structure = {};

  Object.keys(files).forEach((path) => {
    if (path.endsWith("/")) {
      addFolderToStructure(structure, path);
    } else {
      addFileToStructure(structure, path, files[path]);
    }
  });

  return structure;
}

function addFolderToStructure(structure, folderPath) {
  const parts = folderPath.split("/").filter(Boolean);
  let current = structure;

  parts.forEach((part, idx) => {
    if (!current[part]) {
      current[part] = {
        type: "folder",
        path: parts.slice(0, idx + 1).join("/") + "/",
        children: {},
      };
    }
    current = current[part].children;
  });
}

function addFileToStructure(structure, filePath, content) {
  const parts = filePath.split("/").filter(Boolean);
  let current = structure;

  parts.forEach((part, idx) => {
    const isLast = idx === parts.length - 1;

    if (isLast) {
      current[part] = {
        type: "file",
        path: filePath,
        content,
      };
    } else {
      if (!current[part]) {
        current[part] = {
          type: "folder",
          path: parts.slice(0, idx + 1).join("/") + "/",
          children: {},
        };
      }
      current = current[part].children;
    }
  });
}
