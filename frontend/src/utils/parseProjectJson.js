// src/utils/parseProjectJson.js
export function parseProjectJson(raw) {
  if (!raw) throw new Error("Empty input to parseProjectJson");

  let obj = null;

  if (typeof raw === "object") {
    obj = raw;
  } else {
    const cleaned = String(raw).trim()
      .replace(/^```json\s*/i, "")
      .replace(/```$/i, "");

    try {
      obj = JSON.parse(cleaned);
    } catch (e) {
      throw new Error("LLM did not return valid JSON.");
    }
  }

  if (!obj || typeof obj !== "object") {
    throw new Error("Parsed content is not an object.");
  }

  if (!obj.structure || typeof obj.structure !== "object") {
    throw new Error('Missing "structure" object in LLM output.');
  }

  const name = obj.project || obj.name || "Untitled Project";
  const structure = obj.structure || {};

  let type = (obj.type || "").toLowerCase();
  const fileKeys = Object.keys(structure).map((k) => k.replace(/^\//, ""));

  if (!type) {
    if (fileKeys.some((p) => p === "index.html" || p.endsWith(".html"))) {
      type = "html";
    } else if (
      fileKeys.some((p) => p === "src/main.jsx" || p === "src/main.tsx" || p.endsWith(".jsx") || p.endsWith(".tsx"))
    ) {
      type = "react";
    } else if (fileKeys.some((p) => p.endsWith(".js"))) {
      type = "js";
    } else {
      type = "other";
    }
  }

  // 🚀 ENHANCEMENT: Create proper folder structure
  const normalized = {};
  const projectFolder = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase(); // Clean folder name
  
  for (const [rawPath, content] of Object.entries(structure)) {
    const path = String(rawPath).replace(/^\//, "");
    
    // ✅ CRITICAL FIX: Skip empty folders that cause ENOENT errors
    if ((path.endsWith('/') && (!content || content.trim() === '')) || 
        (!content || content.trim() === '')) {
      console.log(`⏭️  Skipping empty folder in parser: ${path}`);
      continue;
    }
    
    // Prepend project folder to all files
    const fullPath = `${projectFolder}/${path}`;
    normalized[fullPath] = typeof content === "string" ? content : JSON.stringify(content, null, 2);
  }

  // Also create a package.json for React projects if missing
  if (type === 'react' && !fileKeys.some(k => k.includes('package.json'))) {
    normalized[`${projectFolder}/package.json`] = JSON.stringify({
      name: projectFolder,
      private: true,
      version: "1.0.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview"
      },
      dependencies: {
        "react": "^18.2.0",
        "react-dom": "^18.2.0"
      },
      devDependencies: {
        "@vitejs/plugin-react": "^4.0.0",
        "vite": "^4.4.0"
      }
    }, null, 2);
  }

  return { name, files: normalized, type };
}