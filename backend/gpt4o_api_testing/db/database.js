const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'looma.db');

// Ensure the directory exists (needed for Railway volume mounts like /data)
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

// Performance and integrity settings
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create all tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    email      TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS projects (
    id           TEXT PRIMARY KEY,
    name         TEXT NOT NULL,
    description  TEXT DEFAULT '',
    owner_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_path TEXT NOT NULL,
    project_type TEXT DEFAULT 'react',
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS collaborators (
    id           TEXT PRIMARY KEY,
    project_id   TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id      TEXT REFERENCES users(id) ON DELETE CASCADE,
    email        TEXT NOT NULL,
    role         TEXT DEFAULT 'editor',
    status       TEXT DEFAULT 'pending',
    invite_token TEXT UNIQUE,
    invited_by   TEXT REFERENCES users(id),
    invited_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    accepted_at  DATETIME
  );

  CREATE INDEX IF NOT EXISTS idx_projects_owner        ON projects(owner_id);
  CREATE INDEX IF NOT EXISTS idx_collaborators_project ON collaborators(project_id);
  CREATE INDEX IF NOT EXISTS idx_collaborators_email   ON collaborators(email);
  CREATE INDEX IF NOT EXISTS idx_collaborators_token   ON collaborators(invite_token);
  CREATE INDEX IF NOT EXISTS idx_collaborators_user    ON collaborators(user_id);
`);

module.exports = db;
