// backend/services/gitService.js
const fs = require('fs-extra');
const path = require('path');
const simpleGit = require('simple-git');

class GitService {
  constructor() {}

_git(projectPath) {
  if (!projectPath) throw new Error("Missing projectPath for git operations");

  const fs = require("fs-extra");
  fs.ensureDirSync(projectPath);  // 🟢 FIX: ensure directory exists

  return simpleGit({ baseDir: projectPath });
}



  /* ---------------------------
     STATUS (staged, modified)
  ---------------------------- */
  async getStatus(projectPath) {
    try {
      const git = this._git(projectPath);
      const status = await git.status();

      return {
        success: true,
        hasGit: true,
        staged: status.staged || [],
        modified: status.modified || [],
        untracked: status.not_added || []
      };

    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /* ---------------------------
     INIT
  ---------------------------- */
  async initRepository(projectPath) {
    try {
      if (!projectPath) throw new Error('Missing projectPath');
      await fs.ensureDir(projectPath);

      const git = this._git(projectPath);

      const gitDir = path.join(projectPath, ".git");
      if (await fs.pathExists(gitDir)) {
        return { success: true, message: "Git already initialized" };
      }

      await git.init();

      await git.addConfig("user.email", process.env.GIT_USER_EMAIL || "looma@example.com");
      await git.addConfig("user.name", process.env.GIT_USER_NAME || "Looma AI");

      return { success: true, message: "Git repository initialized" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /* ---------------------------
     STAGE / UNSTAGE
  ---------------------------- */
  async stageFile(projectPath, filePath) {
    const git = this._git(projectPath);
    try {
      await git.add(filePath);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async unstageFile(projectPath, filePath) {
    const git = this._git(projectPath);
    try {
      await git.reset(['HEAD', filePath]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /* ---------------------------
     BRANCH OPS
  ---------------------------- */
  async switchBranch(projectPath, branch) {
    const git = this._git(projectPath);
    try {
      await git.checkout(branch);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async createBranch(projectPath, branch) {
    const git = this._git(projectPath);
    try {
      await git.checkoutLocalBranch(branch);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async deleteBranch(projectPath, branch) {
    const git = this._git(projectPath);
    try {
      await git.deleteLocalBranch(branch, true);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async listBranches(projectPath) {
    const git = this._git(projectPath);
    try {
      const b = await git.branch();
      return { success: true, branches: b.all, current: b.current };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /* ---------------------------
     DIFF
  ---------------------------- */
  async getDiff(projectPath, filePath, staged = false) {
    const git = this._git(projectPath);
    try {
      let diff;
      if (staged) diff = await git.diff(['--cached', filePath]);
      else diff = await git.diff([filePath]);

      return { success: true, diff };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /* ---------------------------
     COMMIT
  ---------------------------- */
  async commitChanges(projectPath, message) {
    const git = this._git(projectPath);
    try {
      await git.commit(message);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /* ---------------------------
     INFO
  ---------------------------- */
  async getRepoInfo(projectPath) {
    const git = this._git(projectPath);
    try {
      const status = await git.status();
      return {
        success: true,
        stagedCount: (status.staged || []).length
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /* ---------------------------
     HISTORY
  ---------------------------- */
  async getHistory(projectPath, limit) {
    const git = this._git(projectPath);
    try {
      const log = await git.log({ maxCount: limit });
      return { success: true, commits: log.all };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

module.exports = new GitService();
