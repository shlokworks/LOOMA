import React, { useEffect, useMemo, useRef } from "react";
import FileTree from "../components/FileTree";
import { useSafeStore } from "../store/useSafeStore";
import LivePreview from "../components/LivePreview";

export default function LivePreviewTestPage() {
  const hasInitialized = useRef(false);

  const files = useSafeStore((state) => state.files);
  const activeFile = useSafeStore((state) => state.activeFile);
  const setActiveFile = useSafeStore((state) => state.setActiveFile);

  const fileList = useMemo(() => Object.keys(files || {}), [files]);

  useEffect(() => {
    if (!hasInitialized.current && fileList.length > 0) {
      hasInitialized.current = true;
      setActiveFile(fileList[0]);
    }
  }, [fileList, setActiveFile]);

  const handleFileSelect = (path) => {
    if (path !== activeFile) setActiveFile(path);
  };

  if (!fileList.length) {
    return <div className="p-4 text-red-500">No files loaded.</div>;
  }

  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="font-semibold mb-2">📁 File Tree</h2>
        <FileTree
          files={fileList}
          activePath={activeFile}
          onSelect={handleFileSelect}
        />
      </aside>

      <main className="flex-1 p-4 overflow-auto">
        <LivePreview />
      </main>
    </div>
  );
}
