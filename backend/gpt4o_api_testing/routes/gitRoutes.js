 // backend/routes/gitRoutes.js
const express = require("express");
const router = express.Router();

const gitService = require("../services/gitService");
const githubService = require("../services/githubService");

/* ============================================================
   GIT STATUS (FULL STATUS FOR SIDEBAR)
============================================================ */
router.get("/status", async (req, res) => {
  const { projectPath } = req.query;
  if (!projectPath)
    return res.json({ success: false, error: "projectPath required" });

  const result = await gitService.getStatus(projectPath);
  res.json(result);
});

/* ============================================================
   INIT LOCAL REPO
============================================================ */
router.post("/init", async (req, res) => {
  const { projectPath } = req.body;
  if (!projectPath)
    return res.json({ success: false, error: "projectPath required" });

  const result = await gitService.initRepository(projectPath);
  res.json(result);
});

/* ============================================================
   STAGE A FILE
============================================================ */
router.post("/stage", async (req, res) => {
  const { projectPath, filePath } = req.body;

  if (!projectPath || !filePath)
    return res.json({ success: false, error: "projectPath and filePath required" });

  const result = await gitService.stageFile(projectPath, filePath);
  res.json(result);
});

/* ============================================================
   UNSTAGE A FILE
============================================================ */
router.post("/unstage", async (req, res) => {
  const { projectPath, filePath } = req.body;

  if (!projectPath || !filePath)
    return res.json({ success: false, error: "projectPath and filePath required" });

  const result = await gitService.unstageFile(projectPath, filePath);
  res.json(result);
});

/* ============================================================
   GET DIFF (staged + unstaged)
============================================================ */
router.get("/diff", async (req, res) => {
  const { projectPath, filePath, staged } = req.query;

  if (!projectPath || !filePath)
    return res.json({ success: false, error: "projectPath and filePath are required" });

  const isStaged = staged === "true";
  const result = await gitService.getDiff(projectPath, filePath, isStaged);
  res.json(result);
});

/* ============================================================
   COMMIT CHANGES
============================================================ */
router.post("/commit", async (req, res) => {
  const { projectPath, message } = req.body;

  if (!projectPath)
    return res.json({ success: false, error: "projectPath required" });

  const result = await gitService.commitChanges(projectPath, message || "Update");
  res.json(result);
});

/* ============================================================
   GET COMMIT HISTORY
============================================================ */
router.get("/history", async (req, res) => {
  const { projectPath, limit } = req.query;

  if (!projectPath)
    return res.json({ success: false, error: "projectPath required" });

  const result = await gitService.getHistory(projectPath, parseInt(limit) || 20);
  res.json(result);
});

/* ============================================================
   LIST BRANCHES
============================================================ */
router.get("/branches", async (req, res) => {
  const { projectPath } = req.query;

  if (!projectPath)
    return res.json({ success: false, error: "projectPath required" });

  const result = await gitService.listBranches(projectPath);
  res.json(result);
});

/* ============================================================
   SWITCH BRANCH
============================================================ */
router.post("/switch-branch", async (req, res) => {
  const { projectPath, branchName } = req.body;

  if (!projectPath || !branchName)
    return res.json({ success: false, error: "projectPath and branchName required" });

  const result = await gitService.switchBranch(projectPath, branchName);
  res.json(result);
});

/* ============================================================
   CREATE NEW BRANCH
============================================================ */
router.post("/create-branch", async (req, res) => {
  const { projectPath, branchName } = req.body;

  if (!projectPath || !branchName)
    return res.json({ success: false, error: "projectPath and branchName required" });

  const result = await gitService.createBranch(projectPath, branchName);
  res.json(result);
});

/* ============================================================
   DELETE BRANCH
============================================================ */
router.post("/delete-branch", async (req, res) => {
  const { projectPath, branchName } = req.body;

  if (!projectPath || !branchName)
    return res.json({ success: false, error: "projectPath and branchName required" });

  const result = await gitService.deleteBranch(projectPath, branchName);
  res.json(result);
});

/* ============================================================
   REPO INFO (used for stagedCount)
============================================================ */
router.get("/info", async (req, res) => {
  const { projectPath } = req.query;

  if (!projectPath)
    return res.json({ success: false, error: "projectPath required" });

  const result = await gitService.getRepoInfo(projectPath);
  res.json(result);
});

/* ============================================================
   GITHUB: CREATE REPO
============================================================ */
router.post("/github/create-repo", async (req, res) => {
  const token = req.session?.githubToken;
  const { repoName, isPrivate } = req.body;

  if (!token)
    return res.json({ success: false, error: "Not authenticated with GitHub" });

  if (!repoName)
    return res.json({ success: false, error: "repoName required" });

  const result = await githubService.createRepo(token, repoName, !!isPrivate);
  res.json(result);
});

/* ============================================================
   GITHUB: PUSH FILES
============================================================ */
/**
 * Your GitHubPushModal sends:
 * {
 *   repoFullName,
 *   projectPath
 * }
 *
 * So we read all files from projectPath automatically.
 */
router.post("/github/push", async (req, res) => {
  const fs = require("fs-extra");
  const path = require("path");

  try {
    const token = req.session?.githubToken;
    const { repoFullName, projectPath } = req.body;

    if (!token)
      return res.json({ success: false, error: "Not authenticated with GitHub" });

    if (!repoFullName)
      return res.json({ success: false, error: "repoFullName required" });

    if (!projectPath)
      return res.json({ success: false, error: "projectPath required" });

    // ensure path exists
    if (!await fs.pathExists(projectPath)) {
      return res.json({
        success: false,
        error: `projectPath does not exist: ${projectPath}`
      });
    }

    // IGNORE LIST & SIZE GUARD
    const IGNORES = new Set(["node_modules", ".git", ".github", ".DS_Store"]);
    const MAX_FILE_BYTES = parseInt(process.env.GITHUB_PUSH_MAX_BYTES || "2000000", 10); // 2MB default

    // Walk directory and collect text files (skip ignored dirs and big files)
    const walk = async (dir, base = "") => {
      let out = {};
      const entries = await fs.readdir(dir);

      for (const name of entries) {
        if (IGNORES.has(name)) continue;

        const full = path.join(dir, name);
        const rel = base ? path.join(base, name) : name;
        const stat = await fs.stat(full);

        if (stat.isDirectory()) {
          out = { ...out, ...(await walk(full, rel)) };
        } else {
          // Skip very large files
          if (stat.size > MAX_FILE_BYTES) {
            out[rel] = { skipped: true, reason: `exceeds max size (${stat.size} bytes)` };
            continue;
          }

          // Try reading as text; if fails treat as binary / skip
          try {
            const content = await fs.readFile(full, "utf8");
            out[rel] = content;
          } catch (err) {
            out[rel] = { skipped: true, reason: "binary or unreadable" };
          }
        }
      }
      return out;
    };

const rawFiles = await walk(projectPath, "");


    // Normalize and filter files
    const files = {};
    for (const [p, v] of Object.entries(rawFiles)) {
      if (v && typeof v === "object" && v.skipped) {
        files[p.split(path.sep).join("/")] = v; // keep skipped metadata
      } else {
        const normalized = p.replace(/^\.\/+/, "").split(path.sep).join("/");
        files[normalized] = v;
      }
    }

    const result = await githubService.pushAllFiles(token, repoFullName, files);
    res.json({ success: true, result });

  } catch (err) {
    console.error("🔥 PUSH ERROR:", err);
    res.json({ success: false, error: err.message || String(err) });
  }
});

module.exports = router;