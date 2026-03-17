// src/components/GitHubPushModal.jsx
import React, { useState } from "react";
import { createGithubRepo, pushAllToGithub } from "../utils/gitApi";
import GitHubSuccessModal from "./GitHubSuccessModal.jsx";



export default function GitHubPushModal({
  onClose,
  projectPath,
  githubEmail,
  saveRepoName,   // store repo name into Zustand
  onPushed        // optional callback
}) {
  const [repoName, setRepoName] = useState(
    projectPath
      ? projectPath.split("/").pop().replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase()
      : "my-looma-repo"
  );

  const [loading, setLoading] = useState({
    creating: false,
    pushing: false,
  });

  // ✔ success modal state
  const [successUrl, setSuccessUrl] = useState("");

  const handleCreateAndPush = async () => {
    try {
      setLoading({ creating: true, pushing: false });

      // ------------------------------------------------------------
      // 1️⃣ CREATE GITHUB REPOSITORY
      // ------------------------------------------------------------
      const createRes = await createGithubRepo(repoName);

      setLoading({ creating: false, pushing: false });

      if (!createRes.success) {
        alert(
          "❌ Repo creation failed:\n" +
            JSON.stringify(createRes.error, null, 2)
        );
        return;
      }

      const fullName =
        createRes.repo?.full_name ||
        createRes.fullName ||
        `${(githubEmail || "user").split("@")[0]}/${repoName}`;

      // ------------------------------------------------------------
      // 2️⃣ SAVE REPO NAME TO ZUSTAND FOR FUTURE DIRECT PUSHES
      // ------------------------------------------------------------
      if (saveRepoName) saveRepoName(fullName);

      // ------------------------------------------------------------
      // 3️⃣ PUSH LOCAL FILES TO GITHUB
      // ------------------------------------------------------------
      setLoading({ creating: false, pushing: true });

      const pushRes = await pushAllToGithub(fullName, projectPath);

      setLoading({ creating: false, pushing: false });

      if (!pushRes.success) {
        alert("❌ Push failed:\n" + JSON.stringify(pushRes.error || pushRes));
        return;
      }

      // ------------------------------------------------------------
      // 4️⃣ OPEN SUCCESS MODAL WITH CLICKABLE LINK
      // ------------------------------------------------------------
      setSuccessUrl(`https://github.com/${fullName}`);

      if (onPushed) onPushed();

    } catch (err) {
      console.error(err);
      alert("Unexpected error: " + err.message);
      setLoading({ creating: false, pushing: false });
    }
  };

  return (
    <>
      {/* MAIN MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white dark:bg-gray-800 w-[420px] rounded-2xl p-6 shadow-2xl">
          <h2 className="text-lg font-semibold mb-2">Push to GitHub</h2>

          <div className="text-sm mb-4">
            Connected as{" "}
            <span className="font-medium text-purple-600">
              {githubEmail || "unknown"}
            </span>
          </div>

          <label className="text-xs text-gray-500 dark:text-gray-400">
            Repository Name
          </label>

          <input
            className="w-full border rounded-lg px-3 py-2 mt-1 dark:bg-gray-700"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
          />

          <div className="mt-5 flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
              onClick={onClose}
              disabled={loading.creating || loading.pushing}
            >
              Cancel
            </button>

            <button
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white disabled:opacity-60"
              onClick={handleCreateAndPush}
              disabled={!repoName || loading.creating || loading.pushing}
            >
              {loading.creating
                ? "Creating..."
                : loading.pushing
                ? "Pushing..."
                : "Create & Push"}
            </button>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {successUrl && (
        <GitHubSuccessModal
          url={successUrl}
          onClose={() => {
            setSuccessUrl("");
            onClose(); // closes parent modal too
          }}
        />
      )}
    </>
  );
}
