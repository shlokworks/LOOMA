// src/components/GitDiffPanel.jsx
import React, { useEffect, useState } from "react";
import { getDiff } from "../utils/gitApi";

const GitDiffPanel = ({ projectPath, filePath, staged = false, onRefresh = () => {} }) => {
  const [diff, setDiff] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!filePath) {
      setDiff(null);
      return;
    }
    loadDiff();
  }, [filePath, staged, projectPath]);

  const loadDiff = async () => {
    setLoading(true);
    try {
      const res = await getDiff(projectPath, filePath, staged);
      if (res.success) {
        setDiff(res.diff || "");
      } else {
        setDiff("No diff available");
      }
    } catch (err) {
      setDiff("Error loading diff");
    } finally {
      setLoading(false);
    }
  };

  if (!filePath) {
    return <div className="text-gray-400">Select a file to view diff</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">{filePath}</div>
        <div className="text-xs text-gray-500">{staged ? "Staged" : "Unstaged"}</div>
      </div>

      <div className="flex-1 overflow-auto bg-white dark:bg-gray-900 p-2 rounded border">
        {loading ? (
          <div className="text-sm text-gray-500">Loading diff...</div>
        ) : (
          <pre className="whitespace-pre-wrap text-xs">
            {diff}
          </pre>
        )}
      </div>
    </div>
  );
};

export default GitDiffPanel;
