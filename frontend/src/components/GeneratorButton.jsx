// src/components/GeneratorButton.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApplyGeneratedProject } from "../utils/applyGeneratedProject";

export default function GeneratorButton() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const applyProject = useApplyGeneratedProject();
  const navigate = useNavigate();

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5050'}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        console.error("❌ API request failed");
        return;
      }

      const parsed = await res.json();
      console.log("✅ Received project:", parsed);

      const projectObj = {
        name: parsed.project || parsed.name || "Untitled",
        files: parsed.structure || {},
        type: parsed.type || "unknown",
      };

      // Apply to Zustand + ProjectProvider
      applyProject(projectObj);

      // Navigate automatically based on project type
      if (projectObj.type === "html" || projectObj.type === "js") {
        navigate("/preview-test"); // HTML/JS go to lightweight preview page
      } else {
        navigate("/workspace"); // React/full-stack go to main workspace
      }
    } catch (err) {
      console.error("❌ Generation error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder='Try "Write an HTML page that says Hello Honey"'
        className="border px-3 py-2 rounded text-sm w-72"
      />
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-60"
      >
        {loading ? "Generating..." : "Generate"}
      </button>
    </div>
  );
}
