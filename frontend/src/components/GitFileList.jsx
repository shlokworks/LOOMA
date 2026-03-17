// src/components/GitFileList.jsx
import React from "react";
import { stageFile, unstageFile } from "../utils/gitApi";

const GitFileList = ({ projectPath, gitStatus, onSelectFile = () => {}, onStagedChange = () => {} }) => {
  if (!gitStatus) return <div className="p-4 text-sm text-gray-500">Loading files...</div>;

  const { staged = [], modified = [], untracked = [] } = gitStatus;

  const handleStage = async (file, e) => {
    e.stopPropagation();
    const res = await stageFile(projectPath, file);
    if (res.success) onStagedChange();
    else alert("Failed to stage: " + res.error);
  };

  const handleUnstage = async (file, e) => {
    e.stopPropagation();
    const res = await unstageFile(projectPath, file);
    if (res.success) onStagedChange();
    else alert("Failed to unstage: " + res.error);
  };

  const renderList = (title, list, isStagedSection = false) => (
    <div>
      <div className="px-3 py-2 text-xs text-gray-400">{title} ({list.length})</div>
      {list.map((f) => (
        <div key={f} className="px-3 py-2 flex items-center justify-between hover:bg-gray-50 cursor-pointer" onClick={() => onSelectFile(f)}>
          <div className="truncate pr-2">{f}</div>
          <div className="flex gap-2">
            {isStagedSection ? (
              <button onClick={(e) => handleUnstage(f, e)} className="text-xs px-2 py-1 rounded bg-gray-200">Unstage</button>
            ) : (
              <button onClick={(e) => handleStage(f, e)} className="text-xs px-2 py-1 rounded bg-green-600 text-white">Stage</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="text-sm">
      {renderList("Staged", staged || [], true)}
      {renderList("Modified", modified || [])}
      {renderList("Untracked", untracked || [])}
    </div>
  );
};

export default GitFileList;
