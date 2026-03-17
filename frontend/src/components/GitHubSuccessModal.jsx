import React from "react";

export default function GitHubSuccessModal({ url, onClose }) {
  if (!url) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-[420px] shadow-2xl">
        
        <h2 className="text-lg font-semibold mb-3 text-green-600">
          🎉 Repository Created!
        </h2>

        <p className="text-sm mb-4">Your GitHub repository is ready:</p>

        <a 
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline break-all"
        >
          {url}
        </a>

        <div className="mt-5 flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg bg-blue-500 text-white"
            onClick={() => window.open(url, "_blank")}
          >
            Open Repo
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
