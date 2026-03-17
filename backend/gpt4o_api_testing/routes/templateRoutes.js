const express = require("express");
const fs = require("fs-extra");
const path = require("path");

const router = express.Router();

// Absolute paths - CORRECTED
const TEMPLATES_DIR = path.join(__dirname, "../templates");
const WORKSPACE_DIR = path.join(__dirname, "../projects");

// -----------------------------
// GET /api/templates
// Returns list of all template folders
// -----------------------------
router.get("/", async (req, res) => {
  try {
    console.log("📍 Looking for templates in:", TEMPLATES_DIR);
    
    const folders = await fs.readdir(TEMPLATES_DIR);
    const templates = [];

    for (const folder of folders) {
      const full = path.join(TEMPLATES_DIR, folder);
      const stat = await fs.stat(full);

      if (stat.isDirectory()) {
        templates.push(folder);
      }
    }

    console.log("✅ Found templates:", templates);
    res.json({ success: true, templates });
  } catch (err) {
    console.error("❌ Template list error:", err);
    res.status(500).json({ success: false, error: "Failed to list templates" });
  }
});

// -----------------------------
// POST /api/templates/load
// Copies template → backend/projects/<projectName>
// -----------------------------
router.post("/load", async (req, res) => {
  try {
    const { templateName, projectName } = req.body;

    console.log("=".repeat(50));
    console.log("📥 Template Load Request");
    console.log("📦 Request:", { templateName, projectName });
    console.log("📍 __dirname:", __dirname);
    console.log("📁 TEMPLATES_DIR:", TEMPLATES_DIR);
    console.log("📁 WORKSPACE_DIR:", WORKSPACE_DIR);

    if (!templateName || !projectName) {
      return res.status(400).json({
        success: false,
        error: "templateName and projectName are required",
      });
    }

    const src = path.join(TEMPLATES_DIR, templateName);
    const dest = path.join(WORKSPACE_DIR, projectName);

    console.log("🔍 Source path:", src);
    console.log("🎯 Destination path:", dest);

    // Validate template exists
    const srcExists = await fs.pathExists(src);
    console.log("✅ Source exists?", srcExists);
    
    if (!srcExists) {
      console.log("❌ Template not found!");
      return res.status(404).json({
        success: false,
        error: `Template "${templateName}" not found at ${src}`,
      });
    }

    // Ensure destination directory exists
    await fs.ensureDir(WORKSPACE_DIR);
    console.log("✅ Projects directory ensured");

    // Clear previous project folder (if exists)
    if (await fs.pathExists(dest)) {
      console.log("🗑️ Removing existing destination:", dest);
      await fs.remove(dest);
    }

    // Copy folder recursively
    console.log("📋 Copying template...");
    await fs.copy(src, dest);

    console.log(`✅ Template "${templateName}" copied to: ${dest}`);
    console.log("=".repeat(50));

    res.json({
      success: true,
      message: "Template loaded",
      path: dest,
    });
  } catch (err) {
    console.error("❌ Template load error:", err);
    console.error("❌ Error details:", err.message);
    console.error("❌ Error stack:", err.stack);
    res.status(500).json({
      success: false,
      error: `Failed to load template: ${err.message}`,
    });
  }
});

module.exports = router;