// src/components/GitBranchDropdown.jsx
import React, { useState } from "react";
import { switchBranch, createBranch, deleteBranch } from "../utils/gitApi";

const GitBranchDropdown = ({ projectPath, branches = [], currentBranch, onChange = () => {}, onBranchesUpdated = () => {} }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [newBranch, setNewBranch] = useState("");

  const doSwitch = async (b) => {
    const res = await switchBranch(projectPath, b);
    if (res.success) {
      onChange(b);
      onBranchesUpdated();
    } else {
      alert("Failed to switch: " + res.error);
    }
  };

  const doCreate = async () => {
    if (!newBranch) return alert("Enter branch name");
    const res = await createBranch(projectPath, newBranch);
    if (res.success) {
      setNewBranch("");
      onBranchesUpdated();
    } else alert("Failed: " + res.error);
  };

  const doDelete = async (b, e) => {
    // stop outer click from firing (so delete button doesn't switch branch)
    e.stopPropagation();
    if (!window.confirm(`Delete branch ${b}?`)) return;
    const res = await deleteBranch(projectPath, b);
    if (res.success) onBranchesUpdated();
    else alert("Failed: " + res.error);
  };

  return (
    <div className="relative">
      <button onClick={() => setShowMenu(!showMenu)} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-sm">
        {currentBranch} ▾
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border rounded shadow p-2 z-50">
          <div className="text-xs text-gray-400 mb-2">Branches</div>
          <div className="max-h-40 overflow-auto">
            {branches.map((b) => (
              <div key={b} className="flex items-center justify-between py-1 px-2 hover:bg-gray-50 rounded">
                <div
                  className="truncate cursor-pointer"
                  onClick={() => { doSwitch(b); setShowMenu(false); }}
                >
                  {b}
                </div>
                {b !== currentBranch && (
                  <button
                    onClick={(e) => doDelete(b, e)}
                    className="text-xs px-2 py-0.5 rounded bg-red-100"
                  >
                    Del
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-2">
            <input value={newBranch} onChange={(e) => setNewBranch(e.target.value)} placeholder="new branch" className="w-full px-2 py-1 rounded bg-gray-50 dark:bg-gray-700 text-sm" />
            <div className="flex gap-2 mt-2">
              <button onClick={doCreate} className="flex-1 px-2 py-1 rounded bg-green-600 text-white text-sm">Create</button>
              <button onClick={() => setShowMenu(false)} className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GitBranchDropdown;
