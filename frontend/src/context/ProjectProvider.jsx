import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useProjectStore } from "../store/useProjectStore";

/**
 * ProjectProvider
 *
 * - Holds the "project" object in React Context (used by LandingPage etc).
 *   project = { name: string, files: { "<path>": "<content>" } }
 *
 * - Persists project to localStorage so refresh retains it.
 * - Syncs the context project into the Zustand store (so Workspace + LivePreview read from Zustand).
 *
 * Usage:
 *   const { project, setProject, clearProject } = useProject();
 */
const ProjectCtx = createContext(null);

export function ProjectProvider({ children }) {
  const [project, setProject] = useState(null); // { name, files }

  // Zustand setters
  const setFiles = useProjectStore((s) => s.setFiles);
  const setProjectName = useProjectStore((s) => s.setProjectName);
  const setProjectPath = useProjectStore((s) => s.setProjectPath); // NEW: sync projectPath into store

  // track if we've synced initial load to avoid double writes
  const hasSyncedRef = useRef(false);

  // 1) Persist to localStorage whenever project changes
  useEffect(() => {
    if (project) {
      try {
        localStorage.setItem("looma-project", JSON.stringify(project));
      } catch (e) {
        // ignore persistence errors
        console.warn("Failed to persist project to localStorage", e);
      }
    } else {
      // if project cleared, remove from storage
      localStorage.removeItem("looma-project");
    }
  }, [project]);

  // 2) On mount, load from localStorage into Context and Zustand
  useEffect(() => {
    if (hasSyncedRef.current) return;

    try {
      const cached = localStorage.getItem("looma-project");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object") {
          setProject(parsed);
          // immediately sync to Zustand
          if (parsed.files && typeof parsed.files === "object") {
            setFiles(parsed.files);
            setProjectName(parsed.name || "Untitled Project");
            if (parsed.projectPath) setProjectPath(parsed.projectPath); // NEW: keep projectPath in store
          }
        }
      }
    } catch (e) {
      // ignore parse errors
    } finally {
      hasSyncedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // 3) Whenever "project" in Context changes, sync to Zustand (so Workspace picks it up)
  useEffect(() => {
    if (!project) return;
    // Avoid re-syncing on initial mount if we've already synced from storage
    // (the guard above ensures initial cached value doesn't cause duplicate work)
    try {
      if (project.files && typeof project.files === "object") {
        setFiles(project.files);
        setProjectName(project.name || "Untitled Project");
        if (project.projectPath) setProjectPath(project.projectPath); // NEW: keep projectPath in store
      }
    } catch (e) {
      console.warn("Failed to sync project into store", e);
    }
  }, [project, setFiles, setProjectName, setProjectPath]);

  const clearProject = () => {
    setProject(null);
    setFiles({});
    setProjectName("");
    try {
      localStorage.removeItem("looma-project");
    } catch (e) {}
  };

  return (
    <ProjectCtx.Provider value={{ project, setProject, clearProject }}>
      {children}
    </ProjectCtx.Provider>
  );
}

export function useProject() {
  const ctx = useContext(ProjectCtx);
  if (!ctx) throw new Error("useProject must be used inside ProjectProvider");
  return ctx;
}
