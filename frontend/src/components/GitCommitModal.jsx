// src/components/GitCommitModal.jsx
import React, { useState } from "react";
import { commitChanges } from "../utils/gitApi";

export default function GitCommitModal({ onClose, projectPath, onCommitted }) {
  const [message, setMessage] = useState("");

  const handleCommit = async () => {
    try {
      const res = await commitChanges(projectPath, message || "Update project");
      if (res.success) {
        onCommitted && onCommitted();
        onClose && onClose();
      } else {
        alert("Commit failed: " + (res.error || "Unknown error"));
      }
    } catch (err) {
      alert("Commit error: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[360px] shadow-xl">
        <h2 className="text-lg font-semibold mb-3">Commit Changes</h2>

        <textarea
          className="w-full border px-3 py-2 rounded-lg mb-4"
          placeholder="Commit message..."
          value={message}
          rows={3}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg"
            onClick={() => onClose && onClose()}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={handleCommit}
          >
            Commit
          </button>
        </div>
      </div>
    </div>
  );
}
