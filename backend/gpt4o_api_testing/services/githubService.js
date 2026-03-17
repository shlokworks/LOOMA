const axios = require('axios');

class GithubService {
  constructor() {
    this.base = 'https://api.github.com';
  }

  async createRepo(token, repoName, isPrivate = false) {
    try {
      const res = await axios.post(
        `${this.base}/user/repos`,
        { name: repoName, private: !!isPrivate },
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github+json'
          }
        }
      );
      return { success: true, repo: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data || err.message };
    }
  }

  // Upload (create or update) a single file. If sha is provided, it will update.
  async uploadFile(token, repoFullName, pathOnRepo, content, sha = null, message = null) {
    try {
      // encode path but preserve slashes (encodeURI keeps '/')
      const encodedPath = encodeURI(pathOnRepo);

      const payload = {
        message: message || `Add/update ${pathOnRepo}`,
        content: Buffer.from(content).toString('base64'),
        ...(sha ? { sha } : {})
      };

      const res = await axios.put(
        `${this.base}/repos/${repoFullName}/contents/${encodedPath}`,
        payload,
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github+json'
          }
        }
      );
      return { success: true, data: res.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || err.message,
        status: err.response?.status,
        raw: err.response?.data || null
      };
    }
  }

  // Get file metadata (used to fetch sha for update)
  async getFileMeta(token, repoFullName, pathOnRepo) {
    try {
      const encodedPath = encodeURI(pathOnRepo);
      const res = await axios.get(
        `${this.base}/repos/${repoFullName}/contents/${encodedPath}`,
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github+json'
          }
        }
      );
      return { success: true, data: res.data };
    } catch (err) {
      // 404 simply means file does not exist yet — return details
      return {
        success: false,
        error: err.response?.data?.message || err.message,
        status: err.response?.status,
        raw: err.response?.data || null
      };
    }
  }

  // Push many files: files is an object mapping path -> content
  // Returns per-file result object
  async pushAllFiles(token, repoFullName, files) {
    const results = {};
    for (const [filePath, content] of Object.entries(files)) {
      try {
        // Skip folder markers
        if (!filePath || filePath.endsWith('/')) {
          results[filePath] = { skipped: true, reason: 'folder or empty path' };
          continue;
        }

        // If this entry was marked skipped by walker, pass it through
        if (content && typeof content === 'object' && content.skipped) {
          results[filePath] = content;
          continue;
        }

        // Check if file exists to get sha
        const meta = await this.getFileMeta(token, repoFullName, filePath);
        if (meta.success && meta.data && meta.data.sha) {
          // Update existing file
          const upload = await this.uploadFile(token, repoFullName, filePath, content, meta.data.sha, `Update ${filePath}`);
          results[filePath] = upload;
        } else {
          // Create new file
          const upload = await this.uploadFile(token, repoFullName, filePath, content, null, `Add ${filePath}`);
          results[filePath] = upload;
        }
      } catch (err) {
        results[filePath] = { success: false, error: err.message || String(err) };
      }
    }

    return results;
  }
}

module.exports = new GithubService();