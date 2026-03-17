/**
 * Collaborative editing server using Socket.io + Y.js (CRDT).
 *
 * Architecture:
 *  - One Y.Doc per project (keyed by projectId)
 *  - Each file in the project is a Y.Text in that Y.Doc, keyed by filePath
 *  - Clients join a room named "project:<projectId>"
 *  - On join, client receives the full Y.js state update for the doc
 *  - When a client makes a change, it sends a Y.js binary update
 *  - Server applies it to the Y.Doc and broadcasts to all other room members
 *  - Awareness: cursor positions and user info are broadcast in real-time
 */

const Y = require('yjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const db = require('../db/database');

// Map of projectId -> { doc: Y.Doc, awareness: Map<socketId, {user, cursor}>, timer }
const projectDocs = new Map();

function getOrCreateDoc(projectId) {
  if (!projectDocs.has(projectId)) {
    projectDocs.set(projectId, {
      doc:       new Y.Doc(),
      awareness: new Map(),
    });
  }
  return projectDocs.get(projectId);
}

// User colours for cursor display
const COLOURS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
];
let colourIndex = 0;
function nextColour() { return COLOURS[(colourIndex++) % COLOURS.length]; }

function hasAccess(projectId, userId) {
  if (!projectId || !userId) return false;
  const project = db.prepare('SELECT owner_id FROM projects WHERE id = ?').get(projectId);
  if (!project) return false;
  if (project.owner_id === userId) return true;
  const collab = db.prepare(
    "SELECT id FROM collaborators WHERE project_id = ? AND user_id = ? AND status = 'accepted'"
  ).get(projectId, userId);
  return !!collab;
}

function setupCollabSocket(io) {
  io.on('connection', (socket) => {
    // ── Authenticate via token passed in handshake query ──────────────
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    let currentUser = null;
    try {
      if (token) currentUser = jwt.verify(token, JWT_SECRET);
    } catch { /* unauthenticated */ }

    let currentProjectId = null;
    const userColour = nextColour();

    // ── Join a project room ───────────────────────────────────────────
    socket.on('join-project', ({ projectId }) => {
      if (!currentUser) {
        socket.emit('error', { message: 'Authentication required' });
        return;
      }
      if (!hasAccess(projectId, currentUser.id)) {
        socket.emit('error', { message: 'Access denied to this project' });
        return;
      }

      // Leave previous project if any
      if (currentProjectId) {
        socket.leave(`project:${currentProjectId}`);
        const prev = projectDocs.get(currentProjectId);
        if (prev) {
          prev.awareness.delete(socket.id);
          io.to(`project:${currentProjectId}`).emit('awareness-update', {
            socketId: socket.id,
            removed:  true,
          });
        }
      }

      currentProjectId = projectId;
      socket.join(`project:${projectId}`);

      const { doc, awareness } = getOrCreateDoc(projectId);

      // Send current full Y.js state to the joining client
      const stateUpdate = Y.encodeStateAsUpdate(doc);
      socket.emit('yjs-init', {
        update: Buffer.from(stateUpdate).toString('base64'),
      });

      // Register this user's awareness
      const awarenessEntry = {
        user:   { id: currentUser.id, name: currentUser.name, colour: userColour },
        cursor: null,
      };
      awareness.set(socket.id, awarenessEntry);

      // Tell this client about all other online users in this project
      const onlineUsers = Array.from(awareness.entries())
        .filter(([sid]) => sid !== socket.id)
        .map(([sid, a]) => ({ socketId: sid, ...a }));
      socket.emit('online-users', { users: onlineUsers });

      // Broadcast to others that this user joined
      socket.to(`project:${projectId}`).emit('user-joined', {
        socketId: socket.id,
        user:     awarenessEntry.user,
        cursor:   null,
      });

      console.log(`[collab] ${currentUser.name} joined project ${projectId}`);
    });

    // ── Receive a Y.js update from a client ──────────────────────────
    socket.on('yjs-update', ({ projectId, update }) => {
      if (!currentUser || projectId !== currentProjectId) return;

      const entry = projectDocs.get(projectId);
      if (!entry) return;

      try {
        // Decode base64 update and apply to server Y.Doc
        const updateBytes = Buffer.from(update, 'base64');
        Y.applyUpdate(entry.doc, updateBytes);

        // Broadcast to all OTHER clients in the room
        socket.to(`project:${projectId}`).emit('yjs-update', {
          update,
          senderId: socket.id,
        });
      } catch (err) {
        console.error('[collab] yjs-update error:', err.message);
      }
    });

    // ── Cursor / awareness update ─────────────────────────────────────
    socket.on('cursor-update', ({ projectId, cursor, filePath }) => {
      if (!currentUser || projectId !== currentProjectId) return;
      const entry = projectDocs.get(projectId);
      if (!entry) return;

      const awarenessEntry = entry.awareness.get(socket.id);
      if (awarenessEntry) {
        awarenessEntry.cursor   = cursor;
        awarenessEntry.filePath = filePath;
      }

      socket.to(`project:${projectId}`).emit('cursor-update', {
        socketId: socket.id,
        user:     { id: currentUser.id, name: currentUser.name, colour: userColour },
        cursor,
        filePath,
      });
    });

    // ── Disconnect ────────────────────────────────────────────────────
    socket.on('disconnect', () => {
      if (currentProjectId) {
        const entry = projectDocs.get(currentProjectId);
        if (entry) {
          entry.awareness.delete(socket.id);
          io.to(`project:${currentProjectId}`).emit('user-left', { socketId: socket.id });
        }
      }
    });
  });
}

module.exports = { setupCollabSocket };
