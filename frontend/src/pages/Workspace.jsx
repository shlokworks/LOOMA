import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as Y from "yjs";
import { io } from "socket.io-client";
import { AnimatePresence } from "framer-motion";

import { useProjectStore } from "../store/useProjectStore";
import { useThemeStore }   from "../store/useThemeStore";
import { useAuthStore }    from "../store/useAuthStore";

import TopBar              from "../components/TopBar";
import FileTree            from "../components/FileTree";
import MonacoEditorPane    from "../components/MonacoEditorPane";
import LivePreview         from "../components/LivePreview";
import GitSidebar          from "../components/GitSidebar";
import CollaboratorsPanel  from "../components/CollaboratorsPanel";
import JSZip               from "jszip";
import { saveAs }          from "file-saver";
import { saveFile }        from "../utils/fileApi";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

export default function Workspace() {
  const files             = useProjectStore(s => s.files);
  const setFiles          = useProjectStore(s => s.setFiles);
  const projectName       = useProjectStore(s => s.projectName);
  const activeFile        = useProjectStore(s => s.activeFile);
  const setActiveFile     = useProjectStore(s => s.setActiveFile);
  const updateFileStructure = useProjectStore(s => s.updateFileStructure);
  const projectPath       = useProjectStore(s => s.projectPath);
  const projectId         = useProjectStore(s => s.projectId);

  const { theme }         = useThemeStore();
  const { user, token }   = useAuthStore();

  const navigate = useNavigate();

  // ── UI state ──────────────────────────────────────────────────────────
  const [showNewModal, setShowNewModal]           = useState(false);
  const [newName, setNewName]                     = useState("");
  const [modalType, setModalType]                 = useState("file");
  const [currentFolder, setCurrentFolder]         = useState("");
  const [isExporting, setIsExporting]             = useState(false);
  const [showGitSidebar, setShowGitSidebar]       = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [showMobileFileTree, setShowMobileFileTree] = useState(false);
  const [mobilePanel, setMobilePanel]             = useState("editor"); // 'editor' | 'preview'

  // ── Collab state ──────────────────────────────────────────────────────
  const socketRef       = useRef(null);
  const ydocRef         = useRef(null);       // Y.Doc for this project
  const [onlineUsers, setOnlineUsers]   = useState([]);
  const [remoteCursors, setRemoteCursors] = useState([]);

  const fileList = useMemo(() => Object.keys(files), [files]);

  // Redirect if no files
  useEffect(() => {
    if (!fileList.length) navigate("/new-project", { replace: true });
  }, [fileList, navigate]);

  // Set first active file
  useEffect(() => {
    if (fileList.length && !activeFile) setActiveFile(fileList[0]);
  }, [fileList, activeFile, setActiveFile]);

  // ── Socket.io + Y.js setup ────────────────────────────────────────────
  useEffect(() => {
    if (!projectId || !token) return;

    // Create a fresh Y.Doc for this project session
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    const socket = io(SOCKET_URL, {
      auth:  { token },
      query: { token },
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[collab] connected:", socket.id);
      socket.emit("join-project", { projectId });
    });

    // Receive initial full Y.js state from server
    socket.on("yjs-init", ({ update }) => {
      const bytes = Uint8Array.from(atob(update), c => c.charCodeAt(0));
      Y.applyUpdate(ydoc, bytes);
    });

    // Receive incremental Y.js updates from other clients
    socket.on("yjs-update", ({ update, senderId }) => {
      if (senderId === socket.id) return;
      const bytes = Uint8Array.from(atob(update), c => c.charCodeAt(0));
      Y.applyUpdate(ydoc, bytes);

      // Sync changed file content back to Zustand (so LivePreview etc. stay updated)
      for (const [filePath] of Object.entries(files)) {
        const yText = ydoc.getText(filePath);
        if (yText.length > 0) {
          const newContent = yText.toString();
          // Only update if different to avoid loops
          if (files[filePath] !== newContent) {
            setFiles({ ...files, [filePath]: newContent });
          }
        }
      }
    });

    // Broadcast our Y.js updates to the server
    ydoc.on("update", (update, origin) => {
      if (origin === "seed") return; // don't broadcast the initial seed
      const b64 = btoa(String.fromCharCode(...update));
      socket.emit("yjs-update", { projectId, update: b64 });
    });

    // Online users list (on join)
    socket.on("online-users", ({ users }) => setOnlineUsers(users));
    socket.on("user-joined",  (data)     => setOnlineUsers(prev => [...prev.filter(u => u.socketId !== data.socketId), data]));
    socket.on("user-left",    ({ socketId }) => {
      setOnlineUsers(prev  => prev.filter(u => u.socketId !== socketId));
      setRemoteCursors(prev => prev.filter(c => c.socketId !== socketId));
    });

    // Remote cursor positions
    socket.on("cursor-update", (data) => {
      setRemoteCursors(prev => {
        const filtered = prev.filter(c => c.socketId !== data.socketId);
        return [...filtered, data];
      });
    });

    return () => {
      socket.disconnect();
      ydoc.destroy();
      ydocRef.current  = null;
      socketRef.current = null;
      setOnlineUsers([]);
      setRemoteCursors([]);
    };
  }, [projectId, token]);

  // ── File change handler ────────────────────────────────────────────────
  const handleChange = useCallback((newCode) => {
    setFiles({ ...files, [activeFile]: newCode });
    if (projectPath && activeFile) {
      saveFile(projectPath, activeFile, newCode).catch(console.error);
    }
  }, [files, activeFile, projectPath]);

  // ── Cursor awareness ───────────────────────────────────────────────────
  const handleCursorMove = useCallback((cursor, filePath) => {
    socketRef.current?.emit("cursor-update", { projectId, cursor, filePath });
  }, [projectId]);

  // ── New file/folder helpers ────────────────────────────────────────────
  const openNewFileModal   = (folderPath = "") => { setModalType("file");   setNewName(""); setCurrentFolder(folderPath); setShowNewModal(true); };
  const openNewFolderModal = (parentPath = "") => { setModalType("folder"); setNewName(""); setCurrentFolder(parentPath); setShowNewModal(true); };

  const handleCreateNew = () => {
    if (!newName.trim()) return;
    if (modalType === "file") {
      const fileName = newName.includes(".") ? newName : `${newName}.js`;
      const fullPath = currentFolder ? `${currentFolder}${fileName}` : fileName;
      updateFileStructure({ ...files, [fullPath]: getDefaultFileContent(fileName) });
      setActiveFile(fullPath);
    } else {
      const fullPath = currentFolder ? `${currentFolder}${newName}/` : `${newName}/`;
      updateFileStructure({ ...files, [fullPath]: "" });
    }
    setNewName(""); setCurrentFolder(""); setShowNewModal(false);
  };

  const getDefaultFileContent = (fileName) => {
    if (fileName.endsWith(".js") || fileName.endsWith(".jsx"))
      return `// ${fileName}\nimport React from 'react';\n\nexport default function ${fileName.split(".")[0]}() {\n  return <div>${fileName}</div>;\n}`;
    if (fileName.endsWith(".css"))
      return `/* ${fileName} */\nbody { margin: 0; padding: 0; font-family: Arial, sans-serif; }`;
    if (fileName.endsWith(".html"))
      return `<!DOCTYPE html>\n<html>\n<head><title>${fileName}</title></head>\n<body><h1>Hello</h1></body>\n</html>`;
    if (fileName.endsWith(".json"))
      return `{\n  "name": "${fileName.split(".")[0]}"\n}`;
    return `// ${fileName}`;
  };

  // ── Export ─────────────────────────────────────────────────────────────
  const handleExportProject = async () => {
    setIsExporting(true);
    try {
      const zip           = new JSZip();
      const projectFolder = zip.folder(projectName || "my-project");
      Object.entries(files).forEach(([filePath, content]) => {
        if (!filePath.endsWith("/")) projectFolder.file(filePath, content);
      });
      projectFolder.file("README.md", `# ${projectName || "My Project"}\n\nGenerated with Looma AI\n\nExported: ${new Date().toLocaleString()}`);
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `${projectName || "project"}.zip`);
    } catch { alert("Failed to export. Please try again."); }
    finally { setIsExporting(false); }
  };

  if (!fileList.length || !activeFile) return null;

  return (
    <div className={`h-screen w-full flex flex-col ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <TopBar
        name={projectName || "Untitled Project"}
        onExport={handleExportProject}
        onNewFile={() => openNewFileModal()}
        onNewFolder={() => openNewFolderModal()}
        onToggleGit={() => { setShowGitSidebar(p => !p); if (showCollaborators) setShowCollaborators(false); }}
        showGitSidebar={showGitSidebar}
        isExporting={isExporting}
        onToggleCollaborators={() => { setShowCollaborators(p => !p); if (showGitSidebar) setShowGitSidebar(false); }}
        showCollaborators={showCollaborators}
        onlineUsers={onlineUsers}
      />

      {/* New File/Folder Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`rounded-xl p-6 w-96 shadow-2xl ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
            <h3 className="text-lg font-semibold mb-4">
              Create New {modalType === "file" ? "File" : "Folder"}
              {currentFolder && <span className="text-sm text-gray-500 block mt-1">in {currentFolder}</span>}
            </h3>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder={modalType === "file" ? "filename.js, style.css, etc." : "folder-name"}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === "dark" ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
              }`}
              onKeyPress={e => e.key === "Enter" && handleCreateNew()}
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <button onClick={handleCreateNew} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors">Create</button>
              <button onClick={() => { setShowNewModal(false); setCurrentFolder(""); }} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile panel tabs */}
      <div className={`md:hidden flex border-b ${theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
        <button
          onClick={() => setShowMobileFileTree(p => !p)}
          className={`px-4 py-2 text-xs font-medium flex items-center gap-1.5 border-r ${theme === "dark" ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-600"} ${showMobileFileTree ? "bg-blue-500/10 text-blue-400" : ""}`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
          </svg>
          Files
        </button>
        <button
          onClick={() => setMobilePanel("editor")}
          className={`flex-1 py-2 text-xs font-medium ${mobilePanel === "editor" ? "text-blue-400 border-b-2 border-blue-400" : theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
        >
          Editor
        </button>
        <button
          onClick={() => setMobilePanel("preview")}
          className={`flex-1 py-2 text-xs font-medium ${mobilePanel === "preview" ? "text-purple-400 border-b-2 border-purple-400" : theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
        >
          Preview
        </button>
      </div>

      <div className="flex flex-1 min-h-0 p-2 sm:p-4 gap-2 sm:gap-4 relative">
        {/* Mobile File Tree overlay */}
        {showMobileFileTree && (
          <div className="absolute inset-0 z-40 md:hidden" onClick={() => setShowMobileFileTree(false)}>
            <div
              className={`w-64 h-full shadow-2xl border-r flex flex-col ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
              onClick={e => e.stopPropagation()}
            >
              <div className={`p-3 border-b flex items-center justify-between ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                <h2 className="text-sm font-semibold">Files</h2>
                <div className="flex gap-1">
                  <button onClick={() => openNewFolderModal()} className="p-1 bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    </svg>
                  </button>
                  <button onClick={() => openNewFileModal()} className="p-1 bg-green-500 hover:bg-green-600 text-white rounded transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-2 overflow-auto flex-1">
                <FileTree activePath={activeFile} onSelect={(f) => { setActiveFile(f); setShowMobileFileTree(false); }} onNewFile={openNewFileModal} onNewFolder={openNewFolderModal} />
              </div>
            </div>
          </div>
        )}

        {/* Desktop File Tree */}
        <div className="hidden md:flex w-64 flex-shrink-0 flex-col">
          <div className={`rounded-xl shadow-lg border flex-1 overflow-hidden ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <div className={`p-3 border-b flex items-center justify-between ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
                </svg>
                Files
              </h2>
              <div className="flex gap-1">
                <button onClick={() => openNewFolderModal()} className="p-1 bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors" title="New Folder">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  </svg>
                </button>
                <button onClick={() => openNewFileModal()} className="p-1 bg-green-500 hover:bg-green-600 text-white rounded transition-colors" title="New File">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-2 h-full overflow-auto">
              <FileTree activePath={activeFile} onSelect={setActiveFile} onNewFile={openNewFileModal} onNewFolder={openNewFolderModal} />
            </div>
          </div>
        </div>

        {/* Main area */}
        <div className="flex flex-1 min-w-0 gap-4">
          {/* Editor + Preview */}
          <div className={`flex-1 min-w-0 ${!showGitSidebar && !showCollaborators ? "hidden md:grid grid-cols-2 gap-4" : "hidden md:flex flex-col"}`}>
            {!showGitSidebar && !showCollaborators ? (
              <>
                {/* Editor */}
                <div className={`rounded-xl shadow-lg border overflow-hidden flex flex-col ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                  <div className={`px-4 py-2.5 border-b flex items-center justify-between ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                      </svg>
                      <span className="text-sm font-medium truncate">{activeFile}</span>
                    </div>
                    <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                      {files[activeFile]?.length || 0} chars
                    </span>
                  </div>
                  <div className="flex-1">
                    <MonacoEditorPane
                      path={activeFile}
                      value={files[activeFile]}
                      onChange={handleChange}
                      ydoc={ydocRef.current}
                      onCursorMove={handleCursorMove}
                      remoteCursors={remoteCursors}
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className={`rounded-xl shadow-lg border overflow-hidden flex flex-col ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                  <div className={`px-4 py-2.5 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      <span className="text-sm font-medium">Live Preview</span>
                    </div>
                  </div>
                  <div className="flex-1"><LivePreview /></div>
                </div>
              </>
            ) : (
              <div className={`rounded-xl shadow-lg border overflow-hidden flex flex-col ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                <div className={`px-4 py-2.5 border-b flex items-center justify-between ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                    </svg>
                    <span className="text-sm font-medium truncate">{activeFile}</span>
                  </div>
                  <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    {files[activeFile]?.length || 0} chars
                  </span>
                </div>
                <div className="flex-1">
                  <MonacoEditorPane
                    path={activeFile}
                    value={files[activeFile]}
                    onChange={handleChange}
                    ydoc={ydocRef.current}
                    onCursorMove={handleCursorMove}
                    remoteCursors={remoteCursors}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Mobile single panel view */}
          <div className="flex md:hidden flex-1 min-w-0">
            {mobilePanel === "editor" ? (
              <div className={`flex-1 rounded-xl shadow-lg border overflow-hidden flex flex-col ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                <div className={`px-3 py-2 border-b flex items-center justify-between ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                  <span className="text-xs font-medium truncate">{activeFile}</span>
                  <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{files[activeFile]?.length || 0} chars</span>
                </div>
                <div className="flex-1">
                  <MonacoEditorPane
                    path={activeFile}
                    value={files[activeFile]}
                    onChange={handleChange}
                    ydoc={ydocRef.current}
                    onCursorMove={handleCursorMove}
                    remoteCursors={remoteCursors}
                  />
                </div>
              </div>
            ) : (
              <div className={`flex-1 rounded-xl shadow-lg border overflow-hidden flex flex-col ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                <div className={`px-3 py-2 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                  <span className="text-xs font-medium">Live Preview</span>
                </div>
                <div className="flex-1"><LivePreview /></div>
              </div>
            )}
          </div>

          {/* Git Sidebar */}
          {showGitSidebar && (
            <div className="w-72 flex-shrink-0 flex flex-col">
              <GitSidebar projectPath={projectPath} onCommit={() => {}} />
            </div>
          )}

          {/* Collaborators Panel */}
          <AnimatePresence>
            {showCollaborators && (
              <CollaboratorsPanel onClose={() => setShowCollaborators(false)} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
