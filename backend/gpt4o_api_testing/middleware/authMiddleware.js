const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'looma_jwt_secret_change_in_production';

/**
 * Middleware: verifies JWT from Authorization header.
 * Sets req.user = { id, email, name } on success.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.slice(7);
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Optional auth: attaches req.user if token present, but doesn't block.
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      req.user = jwt.verify(authHeader.slice(7), JWT_SECRET);
    } catch { /* ignore */ }
  }
  next();
}

module.exports = { authMiddleware, optionalAuth, JWT_SECRET };
