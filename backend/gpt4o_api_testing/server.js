require('dotenv').config();
const http    = require('http');
const express = require('express');
const session = require('express-session');
const cors    = require('cors');
const fs      = require('fs-extra');
const path    = require('path');
const { Server } = require('socket.io');

const { routeProjectRequest } = require('./services/projectRouter');
const reactRunner              = require('./services/reactRunnerService');
const { authMiddleware }       = require('./middleware/authMiddleware');
const { setupCollabSocket }    = require('./socket/collabSocket');
const db                       = require('./db/database');
const { v4: uuidv4 }           = require('uuid');

const app        = express();
const httpServer = http.createServer(app);

/* ──────────────────────────────────────────────────────────────
   SOCKET.IO (for real-time collaboration)
────────────────────────────────────────────────────────────── */
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

const io = new Server(httpServer, {
  cors: {
    origin:      ALLOWED_ORIGINS,
    methods:     ['GET', 'POST'],
    credentials: true,
  },
});
setupCollabSocket(io);

/* ──────────────────────────────────────────────────────────────
   BASIC MIDDLEWARE
────────────────────────────────────────────────────────────── */
app.use(express.json({ limit: '10mb' }));

app.use(cors({
  origin:      ALLOWED_ORIGINS,
  methods:     ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(session({
  secret:            process.env.SESSION_SECRET || 'looma_secret_key',
  resave:            false,
  saveUninitialized: false,
  cookie:            { secure: false },
}));

/* ──────────────────────────────────────────────────────────────
   CONFIG: PROJECTS DIR
────────────────────────────────────────────────────────────── */
const PROJECTS_DIR = process.env.PROJECTS_DIR ||
  path.join(__dirname, 'projects');
fs.ensureDirSync(PROJECTS_DIR);

/* ──────────────────────────────────────────────────────────────
   AUTH ROUTES  (public — no JWT required)
────────────────────────────────────────────────────────────── */
const authRoutes = require('./routes/authRoutes');
app.use('/auth/looma', authRoutes);

/* ──────────────────────────────────────────────────────────────
   GITHUB OAUTH ROUTES
────────────────────────────────────────────────────────────── */
console.log('🔍 Loading GitHub OAuth routes...');
try {
  const githubOAuth = require('./routes/githubOAuth');
  app.use('/auth/github', githubOAuth);
  console.log('✅ GitHub OAuth routes loaded');
} catch (error) {
  console.error('❌ ERROR loading GitHub OAuth:', error.message);
}

/* ──────────────────────────────────────────────────────────────
   PROJECT DB ROUTES  (protected)
────────────────────────────────────────────────────────────── */
const projectDbRoutes = require('./routes/projectDbRoutes');
app.use('/api/projects', projectDbRoutes);

/* ──────────────────────────────────────────────────────────────
   TEMPLATE ROUTES  (protected)
────────────────────────────────────────────────────────────── */
const templateRoutes = require('./routes/templateRoutes');
app.use('/api/templates', authMiddleware, templateRoutes);

/* ──────────────────────────────────────────────────────────────
   GIT ROUTES  (protected)
────────────────────────────────────────────────────────────── */
console.log('🔍 Loading Git Routes...');
try {
  const gitRoutes = require('./routes/gitRoutes');
  app.use('/api/git', authMiddleware, gitRoutes);
  console.log('✅ Git routes loaded successfully');
} catch (error) {
  console.error('❌ ERROR loading Git Routes:', error.message);
}

/* ──────────────────────────────────────────────────────────────
   FILE ROUTES  (protected)
────────────────────────────────────────────────────────────── */
console.log('🔍 Loading File Routes...');
try {
  const fileRoutes = require('./routes/fileRoutes');
  app.use('/api/files', authMiddleware, fileRoutes);
  console.log('✅ File routes loaded successfully');
} catch (error) {
  console.error('❌ ERROR loading File Routes:', error.message);
}

/* ──────────────────────────────────────────────────────────────
   HEALTH / TEST
────────────────────────────────────────────────────────────── */
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route works!', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({
    status:          'OK',
    timestamp:       new Date().toISOString(),
    runningProjects: reactRunner.projects.size,
    projectsDir:     PROJECTS_DIR,
  });
});

/* ──────────────────────────────────────────────────────────────
   PROJECT GENERATION  (protected)
────────────────────────────────────────────────────────────── */
app.post('/api/generate', authMiddleware, async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string')
      return res.status(400).json({ error: 'Missing prompt' });

    console.log(`📝 Received prompt: "${prompt}"`);
    const raw = await routeProjectRequest(prompt);

    let parsed;
    try {
      const cleaned = raw.trim().replace(/^```json\s*/i, '').replace(/```$/i, '');
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error('❌ Invalid JSON from model:', raw);
      return res.status(500).json({ error: 'Invalid JSON from model', details: err.message });
    }

    if (!parsed.structure || typeof parsed.structure !== 'object')
      return res.status(500).json({ error: 'Missing or invalid project.structure', received: parsed });

    const safeName     = (parsed.project || 'project').replace(/[^a-z0-9\-_.]/gi, '-').toLowerCase();
    const projectDirName = `${safeName}-${Date.now()}`;
    const projectPath  = path.join(PROJECTS_DIR, projectDirName);

    await fs.ensureDir(projectPath);

    for (const [filePath, content] of Object.entries(parsed.structure)) {
      const resolved = path.join(projectPath, filePath);
      await fs.ensureDir(path.dirname(resolved));
      await fs.writeFile(resolved, typeof content === 'string' ? content : JSON.stringify(content, null, 2), 'utf8');
    }

    console.log(`📁 Wrote project to: ${projectPath}`);

    // Register in DB
    const projectId = uuidv4();
    db.prepare(
      'INSERT INTO projects (id, name, owner_id, project_path, project_type) VALUES (?, ?, ?, ?, ?)'
    ).run(projectId, parsed.project || safeName, req.user.id, projectPath, parsed.type || 'react');

    res.json({
      content:     JSON.stringify(parsed),
      projectType: parsed.type,
      projectName: parsed.project,
      projectPath,
      projectId,
    });
  } catch (err) {
    console.error('❌ Project generation failed:', err);
    res.status(500).json({ error: 'Generation failed', message: err.message });
  }
});

/* ──────────────────────────────────────────────────────────────
   REACT PROJECT RUNNER  (protected)
────────────────────────────────────────────────────────────── */
app.post('/api/run-react-project', authMiddleware, async (req, res) => {
  try {
    const { files, projectName } = req.body;
    if (!files || typeof files !== 'object')
      return res.status(400).json({ error: 'Missing files' });

    const result = await reactRunner.createAndRunProject(files, projectName || 'react-app');
    res.json(result);
  } catch (error) {
    console.error('❌ Error running React project:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/stop-react-project', authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.body;
    if (!projectId) return res.status(400).json({ error: 'Missing projectId' });
    reactRunner.stopProject(projectId);
    res.json({ success: true, message: 'Project stopped' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/running-projects', authMiddleware, (req, res) => {
  const projects = Array.from(reactRunner.projects.entries()).map(([id, p]) => ({
    id, url: p.url, port: p.port, projectPath: p.projectPath || null,
  }));
  res.json({ projects });
});

app.post('/api/cleanup-projects', authMiddleware, (req, res) => {
  try {
    reactRunner.cleanup();
    res.json({ success: true, message: 'All projects cleaned' });
  } catch (error) {
    reactRunner.cleanup();
    res.status(500).json({ error: error.message });
  }
});

/* ──────────────────────────────────────────────────────────────
   GRACEFUL SHUTDOWN
────────────────────────────────────────────────────────────── */
process.on('SIGINT',  () => { reactRunner.cleanup(); process.exit(0); });
process.on('SIGTERM', () => { reactRunner.cleanup(); process.exit(0); });

/* ──────────────────────────────────────────────────────────────
   START SERVER (httpServer, not app.listen, so Socket.io works)
────────────────────────────────────────────────────────────── */
const PORT = process.env.PORT || 5050;
httpServer.listen(PORT, () => {
  console.log(`\n✅ API listening  → http://localhost:${PORT}`);
  console.log(`🔌 Socket.io      → ws://localhost:${PORT}`);
  console.log(`📁 Projects dir   → ${PROJECTS_DIR}\n`);
});
