/**
 * Authentication Middleware
 * Verify Firebase tokens
 */

const { getAuth } = require('../config/firebase.config');

/**
 * Required authentication middleware
 * Requires valid Firebase ID token
 */
async function required(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No authorization token provided'
      });
    }

    const token = authHeader.split('Bearer ')[1];
    const auth = getAuth();

    if (!auth) {
      return res.status(503).json({
        success: false,
        error: 'Authentication service not available'
      });
    }

    // Verify token
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
}

/**
 * Optional authentication middleware
 * Adds user to req if token exists, but doesn't require it
 */
async function optional(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split('Bearer ')[1];
    const auth = getAuth();

    if (!auth) {
      req.user = null;
      return next();
    }

    // Try to verify token
    try {
      const decodedToken = await auth.verifyIdToken(token);
      req.user = decodedToken;
    } catch (error) {
      req.user = null;
    }

    next();

  } catch (error) {
    req.user = null;
    next();
  }
}

module.exports = {
  required,
  optional
};
