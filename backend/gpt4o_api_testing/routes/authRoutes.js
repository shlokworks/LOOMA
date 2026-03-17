const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db       = require('../db/database');
const { authMiddleware, JWT_SECRET } = require('../middleware/authMiddleware');

const router = express.Router();
const TOKEN_EXPIRY = '7d';

/* ──────────────────────────────────────────────────────────────
   POST /auth/register
────────────────────────────────────────────────────────────── */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'name, email and password are required' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (existing)
      return res.status(409).json({ error: 'An account with this email already exists' });

    const id            = uuidv4();
    const password_hash = await bcrypt.hash(password, 12);

    db.prepare(
      'INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)'
    ).run(id, name.trim(), email.toLowerCase(), password_hash);

    // If there are pending invites for this email, link them to the new user
    db.prepare(
      "UPDATE collaborators SET user_id = ? WHERE email = ? AND status = 'pending'"
    ).run(id, email.toLowerCase());

    const token = jwt.sign({ id, email: email.toLowerCase(), name: name.trim() }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

    res.status(201).json({ token, user: { id, name: name.trim(), email: email.toLowerCase() } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/* ──────────────────────────────────────────────────────────────
   POST /auth/login
────────────────────────────────────────────────────────────── */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
    if (!user)
      return res.status(401).json({ error: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

/* ──────────────────────────────────────────────────────────────
   GET /auth/me  (protected)
────────────────────────────────────────────────────────────── */
router.get('/me', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

/* ──────────────────────────────────────────────────────────────
   GET /auth/accept-invite/:token
   Accepts a collaboration invite (called after user is logged in).
────────────────────────────────────────────────────────────── */
router.post('/accept-invite/:token', authMiddleware, (req, res) => {
  try {
    const { token } = req.params;
    const collab = db.prepare("SELECT * FROM collaborators WHERE invite_token = ? AND status = 'pending'").get(token);

    if (!collab) return res.status(404).json({ error: 'Invite not found or already accepted' });

    // Link to logged-in user and mark accepted
    db.prepare(
      "UPDATE collaborators SET user_id = ?, status = 'accepted', accepted_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).run(req.user.id, collab.id);

    const project = db.prepare('SELECT id, name FROM projects WHERE id = ?').get(collab.project_id);
    res.json({ success: true, project });
  } catch (err) {
    console.error('Accept invite error:', err);
    res.status(500).json({ error: 'Failed to accept invite' });
  }
});

/* ──────────────────────────────────────────────────────────────
   GET /auth/invite-info/:token
   Returns project info for an invite token (public, for pre-login display).
────────────────────────────────────────────────────────────── */
router.get('/invite-info/:token', (req, res) => {
  try {
    const collab = db.prepare(
      "SELECT c.*, p.name as project_name, u.name as inviter_name FROM collaborators c JOIN projects p ON c.project_id = p.id LEFT JOIN users u ON c.invited_by = u.id WHERE c.invite_token = ?"
    ).get(req.params.token);

    if (!collab) return res.status(404).json({ error: 'Invite not found' });
    res.json({ email: collab.email, projectName: collab.project_name, inviterName: collab.inviter_name });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch invite info' });
  }
});

module.exports = router;
