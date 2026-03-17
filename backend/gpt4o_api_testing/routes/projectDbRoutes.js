const express  = require('express');
const { v4: uuidv4 } = require('uuid');
const fs       = require('fs-extra');
const path     = require('path');
const db       = require('../db/database');
const { authMiddleware } = require('../middleware/authMiddleware');
const { sendInviteEmail } = require('../services/emailService');

const router = express.Router();

// All routes require auth
router.use(authMiddleware);

/* ──────────────────────────────────────────────────────────────
   Helper: check if user can access a project (owner or accepted collab)
────────────────────────────────────────────────────────────── */
function hasAccess(projectId, userId) {
  const project = db.prepare('SELECT owner_id FROM projects WHERE id = ?').get(projectId);
  if (!project) return false;
  if (project.owner_id === userId) return true;
  const collab = db.prepare(
    "SELECT id FROM collaborators WHERE project_id = ? AND user_id = ? AND status = 'accepted'"
  ).get(projectId, userId);
  return !!collab;
}

/* ──────────────────────────────────────────────────────────────
   GET /api/projects  — list all projects the user owns or collaborates on
────────────────────────────────────────────────────────────── */
router.get('/', (req, res) => {
  const userId = req.user.id;

  const owned = db.prepare(
    'SELECT id, name, description, project_type, created_at, updated_at FROM projects WHERE owner_id = ? ORDER BY updated_at DESC'
  ).all(userId);

  const collab = db.prepare(`
    SELECT p.id, p.name, p.description, p.project_type, p.created_at, p.updated_at,
           u.name as owner_name, c.role
    FROM collaborators c
    JOIN projects p ON c.project_id = p.id
    JOIN users u ON p.owner_id = u.id
    WHERE c.user_id = ? AND c.status = 'accepted'
    ORDER BY p.updated_at DESC
  `).all(userId);

  res.json({
    owned:   owned.map(p => ({ ...p, isOwner: true })),
    shared:  collab.map(p => ({ ...p, isOwner: false })),
  });
});

/* ──────────────────────────────────────────────────────────────
   POST /api/projects  — register a newly generated/loaded project
────────────────────────────────────────────────────────────── */
router.post('/', (req, res) => {
  try {
    const { name, description, projectPath, projectType } = req.body;
    if (!name || !projectPath) return res.status(400).json({ error: 'name and projectPath required' });

    const id = uuidv4();
    db.prepare(
      'INSERT INTO projects (id, name, description, owner_id, project_path, project_type) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(id, name, description || '', req.user.id, projectPath, projectType || 'react');

    res.status(201).json({ id, name, projectPath, projectType });
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ error: 'Failed to register project' });
  }
});

/* ──────────────────────────────────────────────────────────────
   GET /api/projects/:id  — get project metadata + files
────────────────────────────────────────────────────────────── */
router.get('/:id', async (req, res) => {
  try {
    if (!hasAccess(req.params.id, req.user.id))
      return res.status(403).json({ error: 'Access denied' });

    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Read files from disk
    const files = {};
    const readFolder = async (folder, base = '') => {
      const items = await fs.readdir(folder);
      for (const item of items) {
        if (item === 'node_modules' || item === '.git') continue;
        const fullPath = path.join(folder, item);
        const rel      = base ? `${base}/${item}` : item;
        const stat     = await fs.stat(fullPath);
        if (stat.isDirectory()) {
          await readFolder(fullPath, rel);
        } else {
          try { files[rel] = await fs.readFile(fullPath, 'utf8'); } catch { /* skip binary */ }
        }
      }
    };

    if (fs.existsSync(project.project_path)) {
      await readFolder(project.project_path);
    }

    // Touch updated_at
    db.prepare('UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(project.id);

    res.json({ project, files });
  } catch (err) {
    console.error('Get project error:', err);
    res.status(500).json({ error: 'Failed to load project' });
  }
});

/* ──────────────────────────────────────────────────────────────
   PUT /api/projects/:id  — rename / update description
────────────────────────────────────────────────────────────── */
router.put('/:id', (req, res) => {
  const project = db.prepare('SELECT owner_id FROM projects WHERE id = ?').get(req.params.id);
  if (!project || project.owner_id !== req.user.id)
    return res.status(403).json({ error: 'Only the owner can update this project' });

  const { name, description } = req.body;
  db.prepare('UPDATE projects SET name = COALESCE(?, name), description = COALESCE(?, description), updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run(name || null, description ?? null, req.params.id);

  res.json({ success: true });
});

/* ──────────────────────────────────────────────────────────────
   DELETE /api/projects/:id
────────────────────────────────────────────────────────────── */
router.delete('/:id', (req, res) => {
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!project || project.owner_id !== req.user.id)
    return res.status(403).json({ error: 'Only the owner can delete this project' });

  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

/* ──────────────────────────────────────────────────────────────
   GET /api/projects/:id/collaborators
────────────────────────────────────────────────────────────── */
router.get('/:id/collaborators', (req, res) => {
  if (!hasAccess(req.params.id, req.user.id))
    return res.status(403).json({ error: 'Access denied' });

  const rows = db.prepare(`
    SELECT c.id, c.email, c.role, c.status, c.invited_at, c.accepted_at,
           u.name as user_name
    FROM collaborators c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE c.project_id = ?
    ORDER BY c.invited_at DESC
  `).all(req.params.id);

  res.json({ collaborators: rows });
});

/* ──────────────────────────────────────────────────────────────
   POST /api/projects/:id/invite
────────────────────────────────────────────────────────────── */
router.post('/:id/invite', async (req, res) => {
  try {
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    if (!project || project.owner_id !== req.user.id)
      return res.status(403).json({ error: 'Only the owner can invite collaborators' });

    const { email, role = 'editor' } = req.body;
    if (!email) return res.status(400).json({ error: 'email is required' });

    const normalEmail = email.toLowerCase().trim();

    // Don't invite the owner themselves
    if (normalEmail === req.user.email)
      return res.status(400).json({ error: 'You cannot invite yourself' });

    // Check if already invited
    const existing = db.prepare(
      'SELECT id, status FROM collaborators WHERE project_id = ? AND email = ?'
    ).get(req.params.id, normalEmail);

    if (existing && existing.status === 'accepted')
      return res.status(409).json({ error: 'This person is already a collaborator' });
    if (existing && existing.status === 'pending')
      return res.status(409).json({ error: 'An invite has already been sent to this email' });

    const inviteToken = uuidv4();
    const collabId    = uuidv4();

    // Check if the invited email already has an account
    const invitedUser = db.prepare('SELECT id FROM users WHERE email = ?').get(normalEmail);

    db.prepare(
      'INSERT INTO collaborators (id, project_id, user_id, email, role, invite_token, invited_by) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(collabId, req.params.id, invitedUser?.id || null, normalEmail, role, inviteToken, req.user.id);

    // Send invite email
    try {
      await sendInviteEmail(normalEmail, req.user.name, project.name, inviteToken);
    } catch (emailErr) {
      console.error('Email send failed (invite still created):', emailErr.message);
    }

    res.status(201).json({ success: true, message: `Invite sent to ${normalEmail}` });
  } catch (err) {
    console.error('Invite error:', err);
    res.status(500).json({ error: 'Failed to send invite' });
  }
});

/* ──────────────────────────────────────────────────────────────
   DELETE /api/projects/:id/collaborators/:collabId
────────────────────────────────────────────────────────────── */
router.delete('/:id/collaborators/:collabId', (req, res) => {
  const project = db.prepare('SELECT owner_id FROM projects WHERE id = ?').get(req.params.id);
  if (!project || project.owner_id !== req.user.id)
    return res.status(403).json({ error: 'Only the owner can remove collaborators' });

  db.prepare('DELETE FROM collaborators WHERE id = ? AND project_id = ?').run(req.params.collabId, req.params.id);
  res.json({ success: true });
});

module.exports = router;
