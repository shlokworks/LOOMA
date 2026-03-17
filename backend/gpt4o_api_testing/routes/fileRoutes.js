// backend/routes/fileRoutes.js
const express = require("express");
const router = express.Router();
const fs = require("fs-extra");
const path = require("path");

/* ============================================================
   LOAD ALL PROJECT FILES
============================================================ */
router.get("/", async (req, res) => {
  try {
    const { project } = req.query;

    if (!project) {
      return res.json({ success: false, error: "Missing project name" });
    }

    const PROJECTS_DIR = path.join(__dirname, "../projects");
    const projectPath = path.join(PROJECTS_DIR, project);

    if (!fs.existsSync(projectPath)) {
      return res.json({ success: false, error: "Project folder not found" });
    }

    let files = {};

    // recursive function to collect files
    const readFolder = async (folder, base = "") => {
      const items = await fs.readdir(folder);

      for (const item of items) {
        const fullPath = path.join(folder, item);
        const relPath = path.join(base, item);
        const stats = await fs.stat(fullPath);

        if (stats.isDirectory()) {
          await readFolder(fullPath, relPath);
        } else {
          const content = await fs.readFile(fullPath, "utf8");
          files[relPath] = content;
        }
      }
    };

    await readFolder(projectPath);

    res.json({
      success: true,
      files,
      projectPath,
    });

  } catch (err) {
    console.error("❌ File load error:", err);
    res.json({ success: false, error: err.message });
  }
});

/* ============================================================
   WRITE FILE TO DISK
============================================================ */
router.post("/write", async (req, res) => {
  try {
    const { projectPath, filePath, content } = req.body;

    if (!projectPath || !filePath) {
      return res.json({ success: false, error: "projectPath and filePath required" });
    }

    const fullPath = path.join(projectPath, filePath);
    await fs.ensureDir(path.dirname(fullPath));
    await fs.writeFile(fullPath, content, "utf8");

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

/* ============================================================
   READ A SINGLE FILE
============================================================ */
router.get("/read", async (req, res) => {
  try {
    const { projectPath, filePath } = req.query;

    if (!projectPath || !filePath) {
      return res.json({ success: false, error: "projectPath and filePath required" });
    }

    const fullPath = path.join(projectPath, filePath);
    const content = await fs.readFile(fullPath, "utf8");

    res.json({ success: true, content });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

module.exports = router;
